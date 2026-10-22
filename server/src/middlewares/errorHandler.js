import { ApiError } from '../utils/ApiError.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.status || error.statusCode || 500;

  if (status >= 500) {
    console.error('[error]', error);
  }

  res.status(status).json({
    success: false,
    message: error.isOperational ? error.message : 'Something went wrong on the server',
    ...(error.details ? { errors: error.details } : {}),
    ...(error.isOperational ? {} : { detail: error.message }),
  });
}

export { ApiError };
