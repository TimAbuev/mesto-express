class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  NotFoundError,
};

// ApplicationError,
// ValidationError,
// UnauthorizedError,
// OtherCardError,
// AlreadyExistError,
// INTERNAL_SERVER_ERROR,
// NOT_FOUND,
// BAD_REQUEST,
// UNAUTHORIZED,
// ALREADY_EXIST,
// OTHER_CARD,
