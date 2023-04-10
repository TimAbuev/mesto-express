const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema');

const {
  ApplicationError, NotFoundError, ValidationError, UnauthorizedError, INTERNAL_SERVER_ERROR,
  NOT_FOUND, BAD_REQUEST, UNAUTHORIZED,
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
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError();
      } else if (error.code === 11000) {
        res.status(409).send({ message: 'Пользователь с таким email всуществует' });
      } else {
        throw new ApplicationError();
      }
    })
    .catch((error) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function login(req, res) {
  const { email, password } = req.body;

  User
    .findOne({ email })
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
    .then((user) => res.send(user))
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

module.exports = {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar, login,
};
