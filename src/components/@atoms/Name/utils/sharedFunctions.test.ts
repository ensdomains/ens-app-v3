import { describe, it, expect } from 'vitest'

import { insertZeroWidthNonJoinerAtLabel } from './sharedFunctions'


describe('insertZeroWidthNonJoinerAtLabel', () => {
  it('should insert a ZWNJ after the first label', () => {
    const name = insertZeroWidthNonJoinerAtLabel('name.com')
    expect(name).toBe('name\u200C.com')
  })

  it('should insert a ZWNJ after the first label with multiple labels', () => {
    const name = insertZeroWidthNonJoinerAtLabel('name.co.uk')
    expect(name).toBe('name\u200C.co.uk')
  })

  it('should be able to split resulting name by ZWNJ', () => {
    const name = insertZeroWidthNonJoinerAtLabel('name.co.uk')
    const [label, ...rest] = name.split('\u200C')
    expect(label).toBe('name')
    expect(rest.join('')).toBe('.co.uk')
  })
})