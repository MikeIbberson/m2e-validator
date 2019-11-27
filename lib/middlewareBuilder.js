const validator = require('express-validator');

module.exports = class SchemaMiddlewareBuilder {
  constructor(schema = {}, key = '__t') {
    this.schema = schema;
    this.discriminatorKey = key;
  }

  hasMultiple() {
    return (
      Object.keys(this.schema).length > 1 ||
      !this.schema.base
    );
  }

  getDiscriminatedSchema(v) {
    return this.schema[v || 'base'];
  }

  getMiddleware() {
    return this.hasMultiple()
      ? this.exec.bind(this)
      : validator.checkSchema(this.schema.base);
  }

  async exec(req, res, next) {
    let err;
    const v = req.body[this.discriminatorKey];
    const s = this.getDiscriminatedSchema(v);

    if (s) {
      await Promise.all(
        validator.checkSchema(s).map((e) => e.run(req)),
      );
    } else {
      err = new Error(
        't' in req
          ? req.t('messages:discriminatorRequired')
          : 'Discriminator key missing from the request',
      );
    }

    next(err);
  }
};
