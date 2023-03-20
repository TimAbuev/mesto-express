/* eslint-disable max-classes-per-file */
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

module.exports = {
  ApplicationError, NotFoundError, ValidationError,
};
