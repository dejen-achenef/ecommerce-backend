export const checkschemas = (schema) => {
  return async (req, res, next) => {
    const { error } = await schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        object: null,
        errors: error.details.map((d) => d.message),
      });
    }

    next();
  };
};
