const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/userSchema').userSchema;
const errorHandler = require('../middleware/errorHandler');
// const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { NotFoundError } = require('../errors/NotFoundError');
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require('../errors/statusCodes');

function getUsers(req, res, next) {
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => next(err));
}

function getUser(req, res, next) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .catch((error) => { errorHandler(error, req, res, next); });
}

function createUser(req, res, next) {
  const { password: userPassword, ...userProps } = req.body;
  if (userPassword.length < 8) { return res.status(BAD_REQUEST).send({ message: 'Длина пароля должна быть не менее 8 символов' }); }
  return bcrypt.hash(userPassword, 10)
    .then((hash) => User.create({ ...userProps, password: hash }))
    .then((user) => {
      const { password, ...userWithoutPassword } = user.toObject();
      return res.status(201).send(userWithoutPassword);
    })
    .catch((error) => { errorHandler(error, req, res, next); });
}

function login(req, res, next) {
  const { email, password: userPassword } = req.body;
  User
    .findOne({ email }).select('+password')
    .orFail(() => {
      res.status(UNAUTHORIZED).send({ message: 'неверный логин или пароль' });
    })
    .then((user) => bcrypt.compare(userPassword, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        return res.status(UNAUTHORIZED).send({ message: 'неверный логин или пароль' });
      }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, 'shhhhh', { expiresIn: '7d' });
      const { password, ...userWithoutPassword } = user.toObject();
      res.send({ user: userWithoutPassword, jwt });
    })
    .catch((error) => { errorHandler(error, req, res, next); });
}

function refreshProfile(req, res, next) {
  // eslint-disable-next-line max-len
  return User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
    .then(() => {
      res.status(200).send(req.body);
    })
    .catch((error) => { errorHandler(error, req, res, next); });
}

function refreshAvatar(req, res, next) {
  // eslint-disable-next-line max-len
  return User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: true, runValidators: true })
    .then(() => res.status(200).send(req.body))
    .catch((error) => { errorHandler(error, req, res, next); });
}

function getCurrentUser(req, res) {
  User
    .findById(req.user._id)
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
