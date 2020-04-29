class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.code = 'VALIDATION_ERROR';
    this.httpCode = 400;
  }
}

module.exports = BadRequest;
