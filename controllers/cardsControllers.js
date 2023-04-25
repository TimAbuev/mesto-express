const Card = require('../models/cardSchema').cardSchema;
const errorHandler = require('../middleware/errorHandler');
const { NotFoundError } = require('../errors/NotFoundError');
const { OtherCardError } = require('../errors/OtherCardError');

function getCards(req, res, next) {
  return Card.find({}).populate('owner').populate('likes')
    .then((cards) => res.status(200).send(cards))
    .catch((error) => { errorHandler(error, req, res, next); });
}

function createCard(req, res, next) {
  return Card.create({ ...req.body, owner: req.user._id })
    .then((card) => Card.populate(card, { path: 'owner' }, { path: 'likes' }))
    .then((card) => res.status(201).send(card))
    .catch((error) => { errorHandler(error, req, res, next); });
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById({ _id: cardId })
    .then((card) => {
      if (userId !== card.owner.toString()) {
        console.log(`req.user._id = ${typeof userId}; card.owner = ${typeof card.owner}`);
        throw new OtherCardError();
      }
      return Card.deleteOne({ _id: cardId });
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      errorHandler(err, req, res, next);
    });
}

function addLike(req, res, next) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate('owner').populate('likes')
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      errorHandler(err, req, res, next);
    });
}

function removeLike(req, res, next) {
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).populate('owner').populate('likes')
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      errorHandler(err, req, res, next);
    });
}

module.exports = {
  getCards, createCard, deleteCard, addLike, removeLike,
};
