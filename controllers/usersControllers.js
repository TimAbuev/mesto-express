const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/userSchema');

const {
  ApplicationError, NotFoundError, UnauthorizedError, INTERNAL_SERVER_ERROR,
  NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, ALREADY_EXIST,
} = require('./errors');

function getUsers(req, res) {
  return User.find({})
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function createUser(req, res) {
  const { password } = req.body;
  if (password.length < 8) {
    return res.status(BAD_REQUEST).send({ message: 'Длина пароля должна быть не менее 8 символов' });
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'Поле должно быть валидным email' });
      } else if (error.code === 11000) {
        res.status(ALREADY_EXIST).send({ message: 'Пользователь с таким email существует' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function login(req, res) {
  const { email, password } = req.body;

  User
    .findOne({ email }).select('+password')
    .orFail(() => {
      throw new UnauthorizedError();
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        throw new UnauthorizedError();
      }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'shhhhh', { expiresIn: '7d' });
      res.send({ user, jwt });
    })
    .catch((error) => {
      if (error instanceof UnauthorizedError) {
        res.status(UNAUTHORIZED).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function refreshProfile(req, res) {
  // eslint-disable-next-line max-len
  return User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(() => {
      res.status(200).send(req.body);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function refreshAvatar(req, res) {
  // eslint-disable-next-line max-len
  return User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(() => res.status(200).send(req.body))
    .catch((error) => {
      if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function getCurrentUser(req, res) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'необходима авторизация' });
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, 'shhhhh');
  } catch {
    res.status(UNAUTHORIZED).send({ message: 'необходима авторизация' });
  }
  User
    .findById(payload._id)
    .orFail(() => { throw new NotFoundError(); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

module.exports = {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar, login, getCurrentUser,
};
