const Card = require('../models/cardSchema');
const mongoose = require('mongoose');
const { ApplicationError, NotFoundError, ValidationError } = require('./errors')

function getCards(req, res) {
  return Card.find({})
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(cards => res.status(200).send(cards))
    .catch(error => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      }
      else {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
}

function createCard(req, res) {
  return Card.create({ ...req.body, owner: req.user._id })
    .then(card => res.status(200).send(req.body))
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

function deleteCard(req, res) {
  const { cardId } = req.params;

  return Card.findOneAndDelete({ _id: cardId })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(card => res.status(200).send(card))
    .catch((error) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(500).send({ message: "Something went wrong." });
      }
    })
}

function addLike(req, res) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then(card => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        res.status(404).send({ message: ` ${error}` })
      }
      else {
        res.status(500).send({ message: "Something went wrong." });
      }
    });
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
