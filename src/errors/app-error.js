class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.httpCode = 500;
  }
}

module.exports = AppError;
