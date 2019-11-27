const { merge, get, pick } = require('lodash');
const ValidationSchemaMapper = require('./map');

module.exports = (s, enforceRequiredPaths = true) => {
  const recursivelyReduceSchema = (
    schema,
    mergeWith,
    next,
  ) =>
    Object.entries(schema.discriminators).reduce(
      (acc, [key, value]) => merge(acc, next(value, key)),
      mergeWith,
    );

  const iterateSchemaPaths = (
    schema = {},
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
              enforceRequiredPaths,
            ).fromTo(get(options, 'type.name', name)),
          },
        });
    });

    return schema.discriminators
      ? recursivelyReduceSchema(
          schema,
          output,
          iterateSchemaPaths,
        )
      : output;
  };

  const iterateChildSchemaPaths = (schema = {}, field) => {
    const output = {};

    schema.childSchemas.reduce(
      (acc, i) =>
        merge(acc, {
          [i.model.path]: iterateSchemaPaths(
            i.schema,
            field,
          ),
        }),
      output,
    );

    return schema.discriminators
      ? recursivelyReduceSchema(
          schema,
          output,
          iterateChildSchemaPaths,
        )
      : output;
  };

  return {
    paths: iterateSchemaPaths(s),
    subpaths: iterateChildSchemaPaths(s),
  };
};
