const ValidationMap = require('../map');

describe('ValidationMap fromTo method', () => {
  it('should return a properly formatted string', () => {
    const out = new ValidationMap({
      enum: ['foo', 'bar'],
      minLength: 1,
      maxLength: 2,
    }).fromTo('string');

    expect(out).toMatchObject({
      trim: true,
      isString: true,
      optional: expect.any(Object),
      isIn: {
        options: [['foo', 'bar']],
      },
    });
  });

  it('should return a properly formatted date', () => {
    const out = new ValidationMap().fromTo('date');
    expect(out).toMatchObject({
      isISO8601: true,
    });
  });
});

describe('ValidationMap getters', () => {
  describe('enum', () => {
    it('should return options', () => {
      const vals = ['FOO', 'BAR'];
      expect(
        new ValidationMap({ enum: vals }).enum,
      ).toMatchObject({
        isIn: {
          options: [vals],
        },
      });
    });

    it('should return empty object', () => {
      expect(new ValidationMap().enum).toMatchObject({});
    });
  });

  describe('range', () => {
    it('should return options', () => {
      expect(
        new ValidationMap({ minLength: 1, maxLength: 1 })
          .length,
      ).toMatchObject({
        isLength: {
          options: {
            min: 1,
            max: 1,
          },
        },
      });
    });
  });

  describe('required', () => {
    it('should return as optional', () => {
      expect(new ValidationMap().required).toMatchObject({
        optional: {
          options: expect.any(Object),
        },
      });
    });

    it('should return as required', () => {
      expect(
        new ValidationMap({ required: true }, true)
          .required,
      ).toMatchObject({
        isEmpty: expect.any(Object),
      });
    });

    it('should return as not nullable', () => {
      expect(
        new ValidationMap({ required: true }, false)
          .required,
      ).toMatchObject({
        optional: {
          nullable: true,
        },
      });
    });
  });
});
