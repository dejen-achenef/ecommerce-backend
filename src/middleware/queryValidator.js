export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({ success: false, message: "Invalid query params", errors: error.details.map(d => d.message) });
    }
    req.query = value;
    return next();
  };
};
