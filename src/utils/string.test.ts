import { it, describe, expect } from "vitest";
import { parseNumericString } from "./string";

describe('parseNumericString', () => {
  it('should return an integer', () => {
    expect(parseNumericString('123')).toBe(123)
  })

  it('should return an integer for a decimal', () => {
    expect(parseNumericString('123.123')).toBe(123)
  })

  it('should return null for a string', () => {
    expect(parseNumericString('abc')).toBe(null)
  })

  it('should return null for an empty string', () => {
    expect(parseNumericString('')).toBe(null)
  })

  it('should return null for a negative number', () => {
    expect(parseNumericString('-123')).toBe(null)
  })

  it('should return null for a negative number', () => {
    expect(parseNumericString('1a23')).toBe(null)
  })
})