const User = require('../models/userSchema');
const mongoose = require('mongoose');
const { ApplicationError, NotFoundError, ValidationError } = require('./errors')

function getUsers(req, res) {
  return User.find({})
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(users => res.status(200).send(users))
    .catch(error => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      }
      else {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(user => res.status(200).send(user))
    .catch((error) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(500).send({ message: "Something went wrong." });
      }
    })
}

function createUser(req, res) {
  return User.create({ ...req.body, owner: req.user._id })
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
        res.status(500).send({ message: "Something went wrong." });
      }
    });
}

function refreshProfile(req, res) {
  return User.findOneAndUpdate({ owner: req.user._id }, { name: req.body.name, about: req.body.about }, { new: true, runValidators: true })
    // .orFail(() => {
    //   throw new NotFoundError();
    // })
    .then((data) => {
      res.status(200).send(req.body);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: error.message })
      }
      else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        res.status(404).send({ message: error.message })
      }
      else {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
}

function refreshAvatar(req, res) {
  return User.findOneAndUpdate({ owner: req.user._id }, { avatar: req.body.avatar })
    .then(data => res.status(200).send(req.body))
    .catch((error) => {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        res.status(404).send({ message: error.message })
      }
      else {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
}


module.exports = {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar
}
