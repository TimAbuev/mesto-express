const mongoose = require('mongoose');
const { OtherCardError } = require('../errors/OtherCardError');

const {
  BAD_REQUEST,
  ALREADY_EXIST,
  OTHER_CARD,
} = require('../errors/statusCodes');

function errorHandler(error, req, res, next) {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(BAD_REQUEST).send({ message: 'что-то не так с запросом' });
  } else if (error instanceof OtherCardError) {
    res.status(OTHER_CARD).send({ message: 'карточка чужая' });
  } else if (error.code === 11000) {
    res.status(ALREADY_EXIST).send({ message: 'такое мыло уже существует' });
  } else {
    next();
  }
}

module.exports = errorHandler;
