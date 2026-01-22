// Maps Prisma errors to HTTP responses
export function prismaErrorHandler(err, req, res, next) {
  if (!err || !err.code) return next(err);
  // Common Prisma codes: P2002 unique constraint, P2025 record not found
  const codeMap = {
    P2002: { status: 409, message: "Unique constraint violation" },
    P2025: { status: 404, message: "Record not found" },
  };
  const mapped = codeMap[err.code];
  if (!mapped) return next(err);
  return res.status(mapped.status).json({ success: false, message: mapped.message, code: err.code });
}
