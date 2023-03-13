const User = require('../models/userSchema');

function getUsers(req, res) {
  return User.find({})
    .then(users => res.status(200).send(users));
}

function getUser(req, res) {
  const{userId} = req.params;
  //const user = users.find((item) => item._id === iddd);
  return User.findById(userId)
    .then(user => res.status(200).send(user))
}

function createUser(req, res) {
  User.create({ ...req.body })
    .then(user => res.status(200).send(req.body)) //опечатка ли у Славика в !user!.status(200) ??
    .catch((err) => {`типо ошибка ${err}`})
}

module.exports = {
  getUser, getUsers, createUser
}
