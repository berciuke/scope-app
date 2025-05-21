const AppError = require('../utils/appError');

// mongoose cast error (bad id)
const handleCastErrorDB = err => {
  const message = `Nieprawidłowa wartość ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// mongodb duplicate key
const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Wartość pola ${value} już istnieje. Proszę użyć innej wartości.`;
  return new AppError(message, 400);
};

// mongoose validation
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Błędy walidacji: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// bad jwt
const handleJWTError = () => 
  new AppError('Nieprawidłowy token. Zaloguj się ponownie.', 401);

// expired jwt
const handleJWTExpiredError = () => 
  new AppError('Token wygasł. Zaloguj się ponownie.', 401);

// dev error response
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  else {
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Coś poszło nie tak!'
    });
  }
};

// error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}; 