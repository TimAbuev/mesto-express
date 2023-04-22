const mongoose = require('mongoose');
const {
  // ApplicationError,
  // NotFoundError,
  // ValidationError,
  // UnauthorizedError,
  // OtherCardError,
  // AlreadyExistError,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  ALREADY_EXIST,
  OTHER_CARD,
} = require('./errors');

function errorHandler(error, req, res) {
  if (error.statusCode === 404) {
    res.status(NOT_FOUND).send({ message: error.message });
  } else if (error instanceof mongoose.Error.ValidationError) {
    res.status(BAD_REQUEST).send({ message: 'что-то не так с запросом' });
  } else if (error.code === 401) {
    res.status(UNAUTHORIZED).send({ message: 'hell yeah' });
  } else if (error.code === 403) {
    res.status(OTHER_CARD).send({ message: 'карточка чужая' });
  } else if (error.code === 11000) {
    res.status(ALREADY_EXIST).send({ message: 'конфликтик мыла' });
    console.log(error);
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Something went wrong.' });
    console.log(error);
  }
}

module.exports = errorHandler;
