const validation = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      validationOptions
    );

    if (error) {
      const validationErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        status: "error",
        errors: validationErrors,
      });
    }

    // Update req with validated values
    req.body = value.body;
    req.query = value.query;
    req.params = value.params;

    return next();
  };
};

module.exports = validation;
