const AppError = require('./../utils/appError');

// HANDLER

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  
  // value = err.keyValue.name;
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please login again!', 401);

// DEV ENV
const sendErrorDev = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  // b) RENDER WEBSITE
  // 1) Log error
  console.log('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'something went wrong!',
    msg: err.message,
  });
};
// DEV PROD
const sendErrorProd = (err, req, res) => {
  // a) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    console.log('ERROR', err);
    if (err.isOperational)
      return res.status(err.statusCode).json({
        status: err.status,
        msg: err.message,
      });
    // b) Programming or other unknown error: don't leak error details'
    // 1) Log error
    console.log('ERROR', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // b) RENDER WEBSITE
  // Operational, trusted error: send message to client
  console.log('ERROR', err);
  if (err.isOperational)
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  // Programming or other unknown error: don't leak error details'
  // 1) Log error
  console.log('ERROR', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message && error._message.split(' ')[2] === 'failed')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
