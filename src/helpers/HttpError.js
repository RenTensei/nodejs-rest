class HttpError {
  constructor(status, message, details = {}) {
    this.message = message;
    this.status = status;
    this.details = details;
  }
}

module.exports = HttpError;
