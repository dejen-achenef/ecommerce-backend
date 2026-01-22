// Centralized error handler and not-found handler

export function notFoundHandler(req, res, next) {
  return res.status(404).json({ success: false, message: "Not Found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_ERROR";

  // Optionally log error here; assuming a simple console.error for now
  // eslint-disable-next-line no-console
  console.error("Error:", { code, message, status, stack: err.stack });

  res.status(status).json({
    success: false,
    message,
    code,
    errors: err.errors || null,
  });
}
