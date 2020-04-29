class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 'RIDES_NOT_FOUND_ERROR';
    this.httpCode = 404;
  }
}

module.exports = NotFoundError;
