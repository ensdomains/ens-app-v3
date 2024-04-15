import { expectTypeOf, test } from 'vitest'

import { matchExactOrNullParamItem } from './matchExactOrNullParamItem'

const key = 'something'
const original = 'aa' as const

const params = {} as object

const matched = matchExactOrNullParamItem(params, { key, original })

test('resolves to correct object for matched type', () => {
  type ExpectedType = object & {
    something: 'aa'
  }
  if (matched) {
    expectTypeOf(params).toEqualTypeOf<ExpectedType>()
  }
})

test('resolves to unknown object for non-matched type', () => {
  if (!matched) {
    expectTypeOf(params).toEqualTypeOf<object>()
  }
})
