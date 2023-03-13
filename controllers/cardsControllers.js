const Card = require('../models/cardSchema');

function getCards(req, res) {
  return Card.find({})
    .then(cards => res.status(200).send(cards));
}

function createCard(req, res) {
  Card.create({ ...req.body })
    .then(card => res.status(200).send(req.body))
    .catch((err) => { `типо ошибка ${err}` })
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  
  return Card.findById(cardId) // узнать метод, который удаляет !!!!!
    .then(user => res.status(200).send(user))
}

module.exports = {
  getCards, createCard, deleteCard
}
