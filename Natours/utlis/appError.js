// inhereting error class and making a custom class called AppError.
class AppError extends Error {
  constructor(message, statusCode) {
    // super keyword for referencing base class from derived class
    super(message);
    this.statusCode = statusCode;
    // for  checking errors like 401,402,403
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

//All the error which are caught by Apperror class are handled by our global handler function
