const { validationResult } = require('express-validator');

// Middleware de validação genérico
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return res.json({ message: 'Erro de validação', errors: errors.array() });
    }

    return next();
  };
};

module.exports = { validate };


