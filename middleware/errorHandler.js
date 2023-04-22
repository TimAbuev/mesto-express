const mongoose = require('mongoose');
const {
  // ApplicationError,
  // NotFoundError,
  // ValidationError,
  // UnauthorizedError,
  // OtherCardError,
  // AlreadyExistError,
  // INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  ALREADY_EXIST,
  OTHER_CARD,
} = require('./errors');

function errorHandler(err, req, res, next) {
  if (err instanceof mongoose.Error.NotFoundError) {
    res.status(NOT_FOUND).send({ message: err.message });
  } else if (err instanceof mongoose.Error.ValidationError) {
    res.status(BAD_REQUEST).send({ message: err.message });
  } else if (err instanceof mongoose.Error.UnauthorizedError) {
    res.status(UNAUTHORIZED).send({ message: 'hell yeah' });
  } else if (err instanceof mongoose.Error.OtherCardError) {
    res.status(OTHER_CARD).send({ message: err.message });
  } else if (err instanceof mongoose.Error.AlreadyExistError) {
    res.status(ALREADY_EXIST).send({ message: err.message });
  } else {
    next(err);
  }
}

module.exports = errorHandler;
