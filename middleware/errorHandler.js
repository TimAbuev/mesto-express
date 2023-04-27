const mongoose = require('mongoose');
const { OtherCardError } = require('../errors/OtherCardError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const {
  BAD_REQUEST,
  ALREADY_EXIST,
  OTHER_CARD,
  UNAUTHORIZED,
} = require('../errors/statusCodes');

function errorHandler(error, req, res, next) {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(BAD_REQUEST).send({ message: 'что-то не так с запросом' });
  } else if (error instanceof OtherCardError) {
    res.status(OTHER_CARD).send({ message: 'карточка чужая' });
  } else if (error.code === 11000) {
    res.status(ALREADY_EXIST).send({ message: 'такое мыло уже существует' });
  } else if (error instanceof UnauthorizedError) {
    res.status(UNAUTHORIZED).send({ message: error.message });
  } else if (error instanceof mongoose.Error.CastError) {
    res.status(BAD_REQUEST).send({ message: error.message });
  } else {
    next();
  }
}

module.exports = errorHandler;
