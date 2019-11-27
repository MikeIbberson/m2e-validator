/* eslint-disable no-param-reassign */
const { merge, get, pick } = require('lodash');
const ValidationSchemaMapper = require('./map');
const { recursivelyReduceSchema } = require('./utils');

/**
 * @TODO
 * Clean up the recursive callback.
 * Definitely, a better way.
 */

const iterateSchemaPaths = (
  schema,
  strictMode = true,
  field = 'base',
) => {
  const output = {};

  schema.eachPath((pathname, t) => {
    const {
      constructor: { name },
      options,
    } = t;

    if (
      (name !== 'SingleNestedPath' &&
        name !== 'DocumentArray' &&
        name !== 'DocumentArrayPath' &&
        pathname !== '_id' &&
        pathname !== 'active' &&
        pathname !== 'createdBy' &&
        pathname !== '__v') ||
      options.includeInRest
    )
      merge(output, {
        [field]: {
          [pathname]: new ValidationSchemaMapper(
            pick(options, [
              'required',
              'systemOnly',
              'unique',
              'minLength',
              'maxLength',
              'min',
              'max',
              'enum',
            ]),
            strictMode,
          ).fromTo(get(options, 'type.name', name)),
        },
      });
  });

  return schema.discriminators
    ? recursivelyReduceSchema(
        schema,
        output,
        ([key, value]) =>
          iterateSchemaPaths(value, strictMode, key),
      )
    : output;
};

const iterateChildPaths = (schema, field = 'base') => {
  const output = {};

  schema.childSchemas.reduce(
    (acc, i) =>
      merge(acc, {
        [i.model.path]: iterateSchemaPaths(i.schema, field),
      }),
    output,
  );

  return schema.discriminators
    ? recursivelyReduceSchema(
        schema,
        output,
        ([key, value]) => iterateChildPaths(value, key),
      )
    : output;
};

module.exports = (s) =>
  Object.assign(s.statics, {
    getSchemaPaths(strict) {
      return iterateSchemaPaths(s, strict);
    },

    getChildPaths(field) {
      return iterateChildPaths(s)[field];
    },
  });
