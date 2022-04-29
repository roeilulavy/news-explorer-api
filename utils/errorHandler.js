// eslint-disable-next-line max-classes-per-file
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

class ForbiddentError extends Error {
  constructor(message) {
    super(message);
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  BadRequestError, AuthorizationError, ForbiddentError, NotFoundError, ConflictError,
};
