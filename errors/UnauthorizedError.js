class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  UnauthorizedError,
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
