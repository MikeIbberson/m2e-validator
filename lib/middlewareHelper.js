const {
  matchedData,
  validationResult,
} = require('express-validator');
const clean = require('clean-object-helper');

module.exports = (req, res, next) => {
  try {
    validationResult(req).throw();
    Object.assign(
      req.body,
      clean(
        matchedData(req, {
          includeOptionals: true,
        }),
      ),
    );

    next();
  } catch (err) {
    next({
      errors: err.mapped(),
    });
  }
};
