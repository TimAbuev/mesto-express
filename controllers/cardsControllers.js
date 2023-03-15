const Card = require('../models/cardSchema');

function getCards(req, res) {
  return Card.find({})
    .then(cards => res.status(200).send(cards));
}

function createCard(req, res) {
  Card.create({ ...req.body, owner: req.user._id })
    .then(card => res.status(200).send(req.body))
    .catch((err) => { `типо ошибка ${err}` })
}

function deleteCard(req, res) {
  const { cardId } = req.params;

  return Card.findOneAndDelete({ _id: cardId })
    .then(card => res.status(200).send(card))
}

function addLike(req, res) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then(card => res.status(200).send(req.body))
}

function removeLike(req, res) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .then(card => res.status(200).send(req.body))
}

module.exports = {
  getCards, createCard, deleteCard, addLike, removeLike
}
