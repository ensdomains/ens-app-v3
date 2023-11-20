import { normalizeAbi } from './useAdvancedEditor'

describe('normalizeAbi', () => {
  it('should normalize abi that is a string', () => {
    expect(normalizeAbi("test")).toEqual({ contentType: 1, data: 'test' })
  })

  it('should normalize abi that is an empty string', () => {
    expect(normalizeAbi("")).toEqual({ contentType: 1, data: '' })
  })

  it('should normalize abi with a string for data', () => {
    expect(normalizeAbi({ data: 'test' })).toEqual({ contentType: 1, data: 'test' })
  })

  it('should normalize abi with an empty string for data', () => {
    expect(normalizeAbi({ data: '' })).toEqual({ contentType: 1, data: '' })
  })

  it('should normalize abi with an object for data', () => {
    expect(normalizeAbi({ data: {test: 'test'} })).toEqual({ contentType: 1, data: '{"test":"test"}' })
  })
  it('should normalize abi with an array for data', () => {
    expect(normalizeAbi({ data: ['test'] })).toEqual({ contentType: 1, data: '["test"]' })
  })

  it('should normalize abi with an object for data', () => {
    expect(normalizeAbi({ data: {test: 'test'} })).toEqual({ contentType: 1, data: '{"test":"test"}' })
  })

  it('should NOT normalize abi that is a number', () => {
    expect(normalizeAbi(5 as any)).toBeUndefined()
  })

  it('should NOT normalize abi that is null', () => {
    expect(normalizeAbi(null as any)).toBeUndefined()
  })

  it('should NOT normalize abi that is undefined', () => {
    expect(normalizeAbi(undefined as any)).toBeUndefined()
  })

  it('should NOT normalize abi with null for data', () => {
    expect(normalizeAbi({ data: null as any})).toBeUndefined()
  })

  it('should NOT normalize abi with undefined for data', () => {
    expect(normalizeAbi({ data: undefined as any})).toBeUndefined()
  })

  it('should NOT normalize abi with a number for data', () => {
    expect(normalizeAbi({ data: 5 as any})).toBeUndefined()
  })
})