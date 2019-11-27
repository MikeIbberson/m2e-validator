const {
  filterFalsy,
  setDynamicErrorMsg,
  minMax,
} = require('./utils');

/**
 * @TODO
 * ObjectId
 * Length
 */

module.exports = class SchemaMap {
  constructor(opts = {}, strict) {
    this.options = opts;
    this.strictMode = strict;

    this.$ref = {
      string: {
        ...this.required,
        ...this.enum,
        trim: true,
        isString: true,
      },
      email: {
        ...this.required,
        isEmail: true,
        normalizeEmail: true,
        trim: true,
      },
      phone: {
        ...this.required,
        isMobilePhone: true,
      },
      url: {
        ...this.required,
        isURL: true,
        trim: true,
      },
      number: {
        ...this.required,
        toFloat: true,
      },
      array: {
        ...this.required,
        custom: {
          options: Array.isArray,
        },
        customSanitizer: {
          options: filterFalsy,
        },
      },
      date: {
        ...this.required,
        isISO8601: true,
      },
      boolean: {
        ...this.required,
        isBoolean: true,
      },
    };
  }

  fromTo(s = '') {
    const {
      options: { systemOnly },
      $ref,
    } = this;
    return !systemOnly
      ? Object.entries($ref).reduce(
          (a, [k, v]) =>
            k.includes(s.toLowerCase())
              ? Object.assign(v, {
                  errorMessage: setDynamicErrorMsg(k),
                })
              : a,
          {},
        )
      : {};
  }

  get enum() {
    const {
      options: { enum: acceptable },
    } = this;
    return Array.isArray(acceptable) && acceptable.length
      ? {
          isIn: {
            options: [acceptable],
            errorMessage: setDynamicErrorMsg('enum', {
              acceptable: acceptable.join(', '),
            }),
          },
        }
      : {};
  }

  get length() {
    const { options } = this;
    return {
      isLength: minMax(options),
    };
  }

  get range() {
    const { options } = this;
    return {
      isNumeric: minMax(options),
    };
  }

  get required() {
    const {
      options: { required },
      strictMode,
    } = this;

    if (required && !strictMode)
      return {
        optional: {
          nullable: true,
          falsy: true,
        },
      };

    if (required)
      return {
        isEmpty: {
          negated: true,
          checkFalsy: true,
          errorMessage: setDynamicErrorMsg('required'),
        },
      };

    return {
      optional: {
        options: {
          checkFalsy: true,
        },
      },
    };
  }
};
