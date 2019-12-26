const {
  matchedData,
  validationResult,
} = require('express-validator');
const { pickBy, identity } = require('lodash');

module.exports = (req, res, next) => {
  try {
    validationResult(req).throw();
    req.body = matchedData(req, { includeOptionals: true });

    next();
  } catch (err) {
    next({
      errors: err.mapped(),
    });
  }
};
