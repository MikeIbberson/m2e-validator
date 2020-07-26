const { checkSchema: spy } = require('express-validator');
const Builder = require('../middlewareBuilder');

jest.mock('express-validator', () => ({
  checkSchema: jest.fn().mockReturnValue([
    {
      run: jest.fn(),
    },
  ]),
}));

describe('MiddlewareBuilder', () => {
  describe('constructor', () => {
    it('should set defaults', () => {
      const defaults = new Builder();
      expect(defaults).toHaveProperty('schema', {});
      expect(defaults).toHaveProperty(
        'discriminatorKey',
        '__t',
      );
    });
  });

  describe('hasMultiple', () => {
    it('should return falsy with only a base', () => {
      expect(
        new Builder({ base: {} }).hasMultiple(),
      ).toBeFalsy();
    });

    it('should return truthy with keys', () => {
      expect(
        new Builder({ foo: {}, bar: {} }).hasMultiple(),
      ).toBeTruthy();
    });
  });

  describe('getDiscriminatedSchema', () => {
    it('should find discriminator by key', () => {
      const kind = { foo: 'bar' };
      expect(
        new Builder({ kind }).getDiscriminatedSchema(
          'kind',
        ),
      ).toMatchObject(kind);
    });

    it('should return undefined', () => {
      expect(
        new Builder().getDiscriminatedSchema('kind'),
      ).toBe(undefined);
    });
  });

  describe('getMiddleware', () => {
    it('should call express-validator checkSchema', () => {
      new Builder({ base: {} }).getMiddleware();
      expect(spy).toHaveBeenCalledWith({});
    });
  });

  describe('exec', () => {
    it('should throw an error', async () => {
      const next = jest.fn();
      const req = { body: {} };
      await new Builder().exec(req, null, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call express-validator checkSchema', async () => {
      const next = jest.fn();
      const discriminator = { isLength: { min: 0 } };
      const req = { body: { __t: 'kind' } };
      await new Builder({ kind: discriminator }).exec(
        req,
        null,
        next,
      );

      expect(spy).toHaveBeenCalledWith(discriminator);
    });
  });
});
