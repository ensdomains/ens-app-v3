import { expect, it } from 'vitest'

import { matchExactOrNullParamItem } from './matchExactOrNullParamItem'

it('matches when item is exactly equal', () => {
  expect(
    matchExactOrNullParamItem(
      { something: ['test123'] },
      {
        key: 'something',
        original: ['test123'],
      },
    ),
  ).toBe(true)
})

it('matches when item is null in params and original is null', () => {
  expect(
    matchExactOrNullParamItem(
      { something: null },
      {
        key: 'something',
        original: null,
      },
    ),
  ).toBe(true)
})

it('does not match when key is not in params', () => {
  expect(
    matchExactOrNullParamItem(
      { somethingElse: ['test123'] },
      {
        key: 'something',
        original: ['test123'],
      },
    ),
  ).toBe(false)
})

it('does not match when key is in params but value is not equal', () => {
  expect(
    matchExactOrNullParamItem(
      { something: ['test123'] },
      {
        key: 'something',
        original: ['test124'],
      },
    ),
  ).toBe(false)
})
