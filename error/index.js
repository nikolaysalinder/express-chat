// const path = require('path');
const util = require('util');
const http = require('http');

// ошибки для выдачи посетителю
function HttpError(status, message) {
  Error.call(this, status, message);
  Error.captureStackTrace(this, HttpError);

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

exports.HttpError = HttpError;
