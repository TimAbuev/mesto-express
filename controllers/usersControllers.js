const mongoose = require('mongoose');
const User = require('../models/userSchema');
const {
  ApplicationError, NotFoundError, ValidationError, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST,
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
  return User.create({ ...req.body })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError();
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
  getUser, getUsers, createUser, refreshProfile, refreshAvatar,
};
