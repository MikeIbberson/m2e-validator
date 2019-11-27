const lang = require('../lang.json');

exports.filterFalsy = (a = []) => a.filter(Boolean);

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
  options: {
    min: min || minLength,
    max: max || maxLength,
  },
});
