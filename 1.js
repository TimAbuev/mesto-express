const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  avatar: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = mongoose.model('user', userSchema);


const User = require('../models/userSchema');

class ApplicationError extends Error {
  constructor(status = 500, message = "Internal Error", name = "Internal Server Error") {
    super();
    this.status = status;
    this.message = message;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApplicationError {
  constructor() {
    super(404, "Resource is not found", "NotFound");
  }
}

class ValidationError extends ApplicationError {
  constructor() {
    super(400, "Incorrect data", "ValidationShit");
  }
}

function getUsers(req, res) {
  return User.find({})
    .orFail(() => {
      throw new ApplicationError();
    })
    .then(users => res.status(200).send(users))
    .catch((error) => {
      res.status(500).send(error);
    })
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(user => res.status(200).send(user))
    .catch((error) => {
      if (error.status === 404) {
        res.status(error.status).send(error)
      }
      else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    })
}

function createUser(req, res) {
  return User.create({ ...req.body, owner: req.user._id })
    .orFail(() => {
      throw new ValidationError();
    })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: ` ${error}` })
      }
      else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    })
}

function refreshProfile(req, res) {
  return User.findOneAndUpdate({owner: req.user._id}, { name: req.body.name, about: req.body.about })
    .then(data => res.status(200).send(req.body))
    .catch((error) => {
      if (error.name === "ValidationError") {
        res.status(400).send({ message: ` ${error}` })
      }
      else if (error.name === "NotFound") {
        res.status(404).send({ message: `Resource is not found` })
      }
      else {
        res.status(500).send({ message
