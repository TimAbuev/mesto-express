const mongoose = require('mongoose');
const Card = require('../models/cardSchema');

const {
  ApplicationError, NotFoundError, ValidationError, OtherCardError,
  INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, OTHER_CARD,
} = require('./errors');

function getCards(req, res) {
  return Card.find({})
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((cards) => res.status(200).send(cards))
    .catch((error) => {
      if (error instanceof ApplicationError) {
        res.status(error.status).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function createCard(req, res) {
  return Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(200).send(card))
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

function deleteCard(req, res) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardId })
    .then((card) => {
      if (userId !== card.owner.toString()) {
        console.log(`req.user._id = ${typeof userId}; card.owner = ${typeof card.owner}`);
        throw new OtherCardError();
      }
      return Card.findByIdAndRemove({ _id: cardId })
        .orFail(() => {
          throw new NotFoundError();
        });
    })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: error.message });
      } else if (error instanceof OtherCardError) {
        res.status(OTHER_CARD).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function addLike(req, res) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

function removeLike(req, res) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        res.status(BAD_REQUEST).send({ message: error.message });
      } else if (error instanceof NotFoundError) {
        res.status(NOT_FOUND).send({ message: error.message });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
      }
    });
}

module.exports = {
  getCards, createCard, deleteCard, addLike, removeLike,
};
