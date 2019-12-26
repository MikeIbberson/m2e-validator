jest.mock('express-validator', () => {
  const exception = jest.fn();

  return {
    exception,
    matchedData: jest.fn(),
    validationResult() {
      return { throw: exception };
    },
  };
});

const { exception } = require('express-validator');
const middle = require('../middlewareHelper');

const next = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Middleware helper function', () => {
  it('should report validation errors', () => {
    const stub = { foo: 'bar' };

    exception.mockImplementation(() => {
      const err = new Error();
      err.mapped = () => stub;
      throw err;
    });

    middle({ body: {} }, null, next);
    expect(next).toHaveBeenCalledWith({
      errors: stub,
    });
  });

  it('should overwrite request body', () => {
    const body = { foo: 'bar' };
    exception.mockReturnValue();

    middle({ body }, null, next);
    expect(next).toHaveBeenCalledWith();
  });
});
