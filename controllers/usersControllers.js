const User = require('../models/userSchema');

function getUsers(req, res) {
  return User.find({})
    .then(users => res.status(200).send(users));
}

function getUser(req, res) {
  const{userId} = req.params;
  
  return User.findById(userId)
    .then(user => res.status(200).send(user))
}

function createUser(req, res) {
  User.create({ ...req.body })
    .then(user => res.status(200).send(req.body))
    .catch((err) => {`типо ошибка ${err}`})
}

function refreshProfile(req, res) {
  return User.replaceOne({ _id: req.user._id}, {name: req.body.name}, {about: req.body.about})
    .then(data => res.status(200).send(req.body))
}

module.exports = {
  getUser, getUsers, createUser, refreshProfile
}
