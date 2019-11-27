const { merge, pickBy, identity } = require('lodash');
const lang = require('../lang.json');

exports.filterFalsy = (a) =>
  Array.isArray(a) ? a.filter(Boolean) : [];

const defaultMessages = (name) =>
  name in lang ? lang[name] : name;

exports.setDynamicErrorMsg = (term) => (
  value,
  { req: { t } },
) =>
  t
    ? t(`validations:${term}`, {
        value,
      })
    : defaultMessages(term);

exports.minMax = ({ minLength, maxLength, min, max }) => ({
  options: pickBy(
    {
      min: min || minLength,
      max: max || maxLength,
    },
    identity,
  ),
});

exports.recursivelyReduceSchema = (s, mergeWith, next) =>
  Object.entries(s.discriminators).reduce(
    (acc, args) => merge(acc, next(args)),
    mergeWith,
  );
