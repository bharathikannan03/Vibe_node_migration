export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 && process.env.NODE_ENV === "production"
    ? "Internal Server Error"
    : err.message;

  console.error("❌ Error:", err.message);

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
};
