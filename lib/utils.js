const {
  compact,
  identity,
  merge,
  pickBy,
} = require('lodash');
const lang = require('../lang.json');

exports.filterFalsy = (a) => {
  const condense = (item) => compact([item].flat());

  try {
    return condense(JSON.parse(a));
  } catch (e) {
    return condense(a);
  }
};
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
