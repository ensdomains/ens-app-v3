import { parseVerificationRecord } from "./parseVerificationRecord";
import { describe, it, expect } from "vitest";

describe('parseVerificationRecord', () => {
  it('should return an array of touples with verification protocol and token', () => {
    const touples = parseVerificationRecord('[["dentity", "token"]]')
    expect(touples).toEqual([['dentity', 'token']])
  })

  it('should accept a record with additional properties in the array', () => {
    const touples = parseVerificationRecord('[["dentity", "token", "futureProperty"]]')
    expect(touples).toEqual([['dentity', 'token', "futureProperty"]])
  })

  it('should not return a touple if the verification protocol is invalid', () => {
     expect(() => parseVerificationRecord('[["notValid", "token"]]')).toThrow()
  })

  it('should return an empty array if records is empty string', () => {
    const touples = parseVerificationRecord('')
    expect(touples).toEqual([])
  })

  it('should return an empty array if records is undefined', () => {
    const touples = parseVerificationRecord(undefined)
    expect(touples).toEqual([])
  })
})