/* eslint-disable max-classes-per-file */
const INTERNAL_SERVER_ERROR = 500;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const ALREADY_EXIST = 409;
const OTHER_CARD = 403;

class ApplicationError extends Error {
  constructor(message = 'Internal Error', status = INTERNAL_SERVER_ERROR, name = 'Internal Server Error') {
    super(message);
    this.status = status;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = 'Resource is not found') {
    super(message, NOT_FOUND, 'NotFound');
  }
}

class ValidationError extends ApplicationError {
  constructor(message = 'Incorrect data') {
    super(message, BAD_REQUEST, 'ValidationProblem');
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = 'UNAUTHORIZED') {
    super(message, UNAUTHORIZED, 'Unauthorized');
  }
}

class OtherCardError extends ApplicationError {
  constructor(message = 'This is not your card') {
    super(message, OTHER_CARD, 'OtherCard');
  }
}

module.exports = {
  ApplicationError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  OtherCardError,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  ALREADY_EXIST,
  OTHER_CARD,
};
