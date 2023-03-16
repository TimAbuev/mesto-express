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
// class ValidationError extends ApplicationError {
//   constructor() {
//     super(400, "Incorrect data", "ValidationError");
//   }
// }

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
  User.create({ ...req.body, owner: req.user._id })
    // .orFail(() => {
    //   throw new NotFoundError();
    // })
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
  return User.findOneAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    // .orFail(() => {
    //   throw new ValidationError();
    // })
    .then(data => res.status(200).send(data))
    .catch((error) => {
      if (error.status === 400) {
        res.status(400).send(error)
      }
      else {
        res.status(500).send({ message: `Internal server error ${error}` });
      }
    })
}

function refreshAvatar(req, res) {
  return User.findOneAndUpdate(req.user._id, { avatar: req.body.avatar })
    .then(data => res.status(200).send(req.body))
}


module.exports = {
  getUser, getUsers, createUser, refreshProfile, refreshAvatar
}
