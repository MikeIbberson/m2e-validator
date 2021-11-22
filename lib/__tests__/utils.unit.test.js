const {
  filterFalsy,
  setDynamicErrorMsg,
  minMax,
} = require('../utils');

test('filterFalsy should filter falsy values', () => {
  expect(
    filterFalsy([null, undefined, 0, 'keep']),
  ).toHaveLength(1);
});

test('filterFalsy should normalize', () => {
  expect(filterFalsy([1, null, 2])).toEqual([1, 2]);
  expect(filterFalsy(1)).toEqual([1]);
});

describe('setDynamicErrorMsg', () => {
  it('should call i18n middleware', () => {
    const t = jest.fn();
    setDynamicErrorMsg('foo')('bar', { req: { t } });
    expect(t).toHaveBeenCalledWith('validations:foo', {
      value: 'bar',
    });
  });

  it('should return text if translator not available', () => {
    expect(
      setDynamicErrorMsg('foo')('bar', { req: {} }),
    ).toBe('foo');
  });
});

describe('minMax', () => {
  it('should prioritize min/max values', () => {
    expect(minMax({ min: 1, max: 1 })).toMatchObject({
      options: {
        max: 1,
        min: 1,
      },
    });
  });

  it('should set minLength/maxLength values', () => {
    expect(
      minMax({ maxLength: 2, minLength: 2 }),
    ).toMatchObject({
      options: {
        max: 2,
        min: 2,
      },
    });
  });
});
