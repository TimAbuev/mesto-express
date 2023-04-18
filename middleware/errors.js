/* eslint-disable max-classes-per-file */
const INTERNAL_SERVER_ERROR = 500;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const ALREADY_EXIST = 409;
const OTHER_CARD = 403;

class ApplicationError extends Error {
  constructor(status = 500, message = 'Internal Error', name = 'Internal Server Error') {
    super();
    this.status = status;
    this.message = message;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}
class NotFoundError extends ApplicationError {
  constructor() {
    super(404, 'Resource is not found', 'NotFound');
  }
}
class ValidationError extends ApplicationError {
  constructor() {
    super(400, 'Incorrect data', 'ValidationProblem');
  }
}
class UnauthorizedError extends ApplicationError {
  constructor() {
    super(401, 'UNAUTHORIZED', 'UNAUTHORIZED');
  }
}
class OtherCardError extends ApplicationError {
  constructor() {
    super(403, 'OtherCard', 'this is not your card');
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
