import { describe, expect, it } from 'vitest'

import { decodeAbi } from './useAdvancedEditor'

// TODO: Remove skip when we know how we will handle abi
describe.skip('normalizeAbi', () => {
  it('should normalize abi that is a string', () => {
    expect(decodeAbi('test')).toEqual({ contentType: 1, data: 'test' })
  })

  // it('should normalize abi that is an empty string', () => {
  //   expect(decodeAbi("")).toEqual({ contentType: 1, data: '' })
  // })

  // it('should normalize abi with a string for data', () => {
  //   expect(decodeAbi({ data: 'test' })).toEqual({ contentType: 1, data: 'test' })
  // })

  // it('should normalize abi with an empty string for data', () => {
  //   expect(decodeAbi({ data: '' })).toEqual({ contentType: 1, data: '' })
  // })

  // it('should normalize abi with an object for data', () => {
  //   expect(decodeAbi({ data: {test: 'test'} })).toEqual({ contentType: 1, data: '{"test":"test"}' })
  // })
  // it('should normalize abi with an array for data', () => {
  //   expect(decodeAbi({ data: ['test'] })).toEqual({ contentType: 1, data: '["test"]' })
  // })

  // it('should normalize abi with an object for data', () => {
  //   expect(decodeAbi({ data: {test: 'test'} })).toEqual({ contentType: 1, data: '{"test":"test"}' })
  // })

  // it('should NOT normalize abi that is a number', () => {
  //   expect(decodeAbi(5 as any)).toBeUndefined()
  // })

  // it('should NOT normalize abi that is null', () => {
  //   expect(decodeAbi(null as any)).toBeUndefined()
  // })

  // it('should NOT normalize abi that is undefined', () => {
  //   expect(decodeAbi(undefined as any)).toBeUndefined()
  // })

  // it('should NOT normalize abi with null for data', () => {
  //   expect(decodeAbi({ data: null as any})).toBeUndefined()
  // })

  // it('should NOT normalize abi with undefined for data', () => {
  //   expect(decodeAbi({ data: undefined as any})).toBeUndefined()
  // })

  // it('should NOT normalize abi with a number for data', () => {
  //   expect(decodeAbi({ data: 5 as any})).toBeUndefined()
  // })
})
