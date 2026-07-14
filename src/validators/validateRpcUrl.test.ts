import { describe, expect, it } from 'vitest'

import { isValidRpcUrl, validateRpcUrl } from './validateRpcUrl'

describe('validateRpcUrl', () => {
  it.each([
    ['https://eth.example.com', true],
    ['https://eth.example.com/v1/key', true],
    ['http://localhost:8545', true],
    ['http://127.0.0.1:8545', true],
    ['http://192.168.1.10:8545', true],
    ['https://1.2.3.4:8545/rpc', true],
  ] as const)('accepts %s', (url, expected) => {
    expect(validateRpcUrl(url)).toBe(expected)
  })

  it.each([
    ['', 'required'],
    [undefined, 'required'],
  ] as const)('returns "required" for empty input (%s)', (url, expected) => {
    expect(validateRpcUrl(url)).toBe(expected)
  })

  it.each([
    ['not a url'],
    ['justtext'],
    ['http://'],
    ['://missing-protocol'],
  ] as const)('rejects malformed url %s', (url) => {
    expect(validateRpcUrl(url)).toBe('invalidUrl')
  })

  it.each([
    ['ws://eth.example.com'],
    ['wss://eth.example.com'],
    ['ftp://eth.example.com'],
    ['ipfs://something'],
    ['file:///etc/passwd'],
  ] as const)('rejects unsupported protocol %s', (url) => {
    expect(validateRpcUrl(url)).toBe('invalidProtocol')
  })

  describe('isValidRpcUrl', () => {
    it('is true for a valid url', () => {
      expect(isValidRpcUrl('https://eth.example.com')).toBe(true)
    })

    it('is false for an invalid url', () => {
      expect(isValidRpcUrl('ws://eth.example.com')).toBe(false)
      expect(isValidRpcUrl('')).toBe(false)
      expect(isValidRpcUrl(undefined)).toBe(false)
    })
  })
})
