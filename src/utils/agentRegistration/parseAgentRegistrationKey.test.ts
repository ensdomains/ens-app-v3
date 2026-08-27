import { describe, expect, it } from 'vitest'

import { isAgentRegistrationKey, parseAgentRegistrationKey } from './parseAgentRegistrationKey'

describe('parseAgentRegistrationKey', () => {
  it('should parse a valid agent-registration key', () => {
    const key =
      'agent-registration[0x00010000018004a169fb4a3325136eb29fa0ceb6d2e539a432148004a169fb4a3325136eb29fa0ceb6d2e539a432][19151]'
    const result = parseAgentRegistrationKey(key)

    expect(result).toEqual({
      registryHex:
        '0x00010000018004a169fb4a3325136eb29fa0ceb6d2e539a432148004a169fb4a3325136eb29fa0ceb6d2e539a432',
      agentId: '19151',
    })
  })

  it('should parse a key with numeric agent ID', () => {
    const key = 'agent-registration[0x0001000001018004a169fb4a3325136eb29fa0ceb6d2e539a432][167]'
    const result = parseAgentRegistrationKey(key)

    expect(result).toEqual({
      registryHex: '0x0001000001018004a169fb4a3325136eb29fa0ceb6d2e539a432',
      agentId: '167',
    })
  })

  it('should return null for non-agent-registration keys', () => {
    expect(parseAgentRegistrationKey('com.twitter')).toBeNull()
    expect(parseAgentRegistrationKey('avatar')).toBeNull()
    expect(parseAgentRegistrationKey('')).toBeNull()
  })

  it('should return null for malformed keys', () => {
    // Missing closing bracket
    expect(parseAgentRegistrationKey('agent-registration[0x1234')).toBeNull()

    // Missing second section
    expect(parseAgentRegistrationKey('agent-registration[0x1234]')).toBeNull()

    // Missing hex prefix
    expect(parseAgentRegistrationKey('agent-registration[1234][5678]')).toBeNull()

    // Empty agent ID
    expect(parseAgentRegistrationKey('agent-registration[0x1234][]')).toBeNull()
  })

  it('should lowercase the registry hex', () => {
    const key = 'agent-registration[0xABCDEF123456][789]'
    const result = parseAgentRegistrationKey(key)

    expect(result?.registryHex).toBe('0xabcdef123456')
  })
})

describe('isAgentRegistrationKey', () => {
  it('should return true for agent-registration keys', () => {
    expect(isAgentRegistrationKey('agent-registration[0x1234][5678]')).toBe(true)
    expect(isAgentRegistrationKey('agent-registration[anything')).toBe(true)
  })

  it('should return false for non-agent-registration keys', () => {
    expect(isAgentRegistrationKey('com.twitter')).toBe(false)
    expect(isAgentRegistrationKey('avatar')).toBe(false)
    expect(isAgentRegistrationKey('')).toBe(false)
    expect(isAgentRegistrationKey('agent-registrations[0x1234]')).toBe(false)
  })
})
