const {
  matchedData,
  validationResult,
} = require('express-validator');

module.exports = (req, res, next) => {
  try {
    validationResult(req).throw();
    Object.assign(
      req.body,
      matchedData(req, { includeOptionals: true }),
    );

    next();
  } catch (err) {
    next({
      errors: err.mapped(),
    });
  }
};
