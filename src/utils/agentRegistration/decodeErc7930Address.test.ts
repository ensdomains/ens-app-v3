import { describe, expect, it } from 'vitest'

import { decodeErc7930Address } from './decodeErc7930Address'

describe('decodeErc7930Address', () => {
  it('should decode a valid ERC-7930 address for Ethereum mainnet', () => {
    // Version: 0001, ChainType: 0000 (EVM), ChainRefLength: 01, ChainRef: 01 (mainnet)
    // AddressLength: 14 (20 bytes), Address: 8004a169fb4a3325136eb29fa0ceb6d2e539a432
    const hex = '0x00010000010114' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    const result = decodeErc7930Address(hex)

    expect(result).toEqual({
      chainId: 1,
      address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
    })
  })

  it('should decode a valid ERC-7930 address for Base (chain ID 8453)', () => {
    // Version: 0001, ChainType: 0000 (EVM), ChainRefLength: 02, ChainRef: 2105 (8453 in hex)
    // AddressLength: 14 (20 bytes), Address: 1234567890abcdef1234567890abcdef12345678
    const hex = '0x0001000002210514' + '1234567890abcdef1234567890abcdef12345678'
    const result = decodeErc7930Address(hex)

    expect(result).toEqual({
      chainId: 8453,
      address: '0x1234567890abcdef1234567890abcdef12345678',
    })
  })

  it('should handle hex without 0x prefix', () => {
    const hex = '00010000010114' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    const result = decodeErc7930Address(hex)

    expect(result).toEqual({
      chainId: 1,
      address: '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432',
    })
  })

  it('should return null for invalid version', () => {
    // Version: 0002 (invalid)
    const hex = '0x00020000010114' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    expect(decodeErc7930Address(hex)).toBeNull()
  })

  it('should return null for non-EVM chain type', () => {
    // ChainType: 0001 (non-EVM)
    const hex = '0x00010001010114' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    expect(decodeErc7930Address(hex)).toBeNull()
  })

  it('should return null for invalid address length', () => {
    // AddressLength: 15 (21 bytes, should be 20)
    const hex = '0x00010000010115' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    expect(decodeErc7930Address(hex)).toBeNull()
  })

  it('should return null for too short hex', () => {
    expect(decodeErc7930Address('0x0001')).toBeNull()
    expect(decodeErc7930Address('')).toBeNull()
  })

  it('should return null for zero chain reference length', () => {
    const hex = '0x00010000000014' + '8004a169fb4a3325136eb29fa0ceb6d2e539a432'
    expect(decodeErc7930Address(hex)).toBeNull()
  })

  it('should return null if address is truncated', () => {
    // Only 10 bytes of address instead of 20
    const hex = '0x00010000010114' + '8004a169fb4a33251'
    expect(decodeErc7930Address(hex)).toBeNull()
  })
})
