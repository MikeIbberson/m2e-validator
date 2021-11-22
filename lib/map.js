const {
  filterFalsy,
  setDynamicErrorMsg,
  minMax,
} = require('./utils');

module.exports = class SchemaMap {
  constructor(opts = {}, strict) {
    this.options = opts;
    this.strictMode = strict;

    this.$ref = {
      string: {
        ...this.length,
        ...this.required,
        ...this.enum,
        isString: true,
        trim: true,
      },
      email: {
        ...this.required,
        isEmail: true,
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
        ...this.range,
        ...this.required,
        toFloat: true,
      },
      objectid: {
        ...this.required,
        isMongoId: true,
      },
      schemaarray: {
        ...this.required,
        custom: {
          options: (v) => {
            try {
              return (
                Array.isArray(v) ||
                Array.isArray(JSON.parse(v))
              );
            } catch (e) {
              return false;
            }
          },
        },
        customSanitizer: {
          options: filterFalsy,
        },
      },
      date: {
        ...this.required,
        toDate: true,
      },
      boolean: {
        ...this.required,
        toBoolean: true,
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
      : {
          customSanitizer: {
            options: () => undefined,
          },
        };
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

    const args = {};

    if (required) {
      if (!strictMode)
        args.optional = {
          nullable: true,
        };

      args.isEmpty = {
        negated: true,
        checkFalsy: true,
        errorMessage: setDynamicErrorMsg('required'),
      };
    } else {
      args.optional = {
        options: {
          checkFalsy: true,
        },
      };
    }

    return args;
  }
};
