import { describe, expect, it } from 'vitest'

import { RegistrationParameters } from '@ensdomains/ensjs/utils'

import { isLegacyRegistration } from './isLegacyRegistration'

describe('isLegacyRegistration', () => {
  it('should return true when there are no records, fuses, or reverse record', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(true)
  })

  it('should return true when there are no records, fuses, or reverse record', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'eth', value: '0x123' }],
        texts: [],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(true)
  })

  it('should return false when there are records', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'eth', value: '0x123' }],
        texts: [],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(true)
  })

  it('should return false when there are records', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 60, value: '0x123' }],
        texts: [],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(true)
  })

  it('should return false when there are records', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'ETH', value: '0x123' }],
        texts: [],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(true)
  })

  it('should return false when there are records', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [
          { coin: 'eth', value: '0x123' },
          { coin: 'btc', value: '0x123' },
        ],
        texts: [],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(false)
  })

  it('should return false when there are records', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'ETH', value: '0x123' }],
        texts: [],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(true)
  })

  it('should return false when there are records', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'ETH', value: '0x123' }],
        texts: [{ key: 'test', value: 'test' }],
        contentHash: '',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(false)
  })

  it('should return false when there are fuses', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: ['CANNOT_APPROVE'],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'eth', value: '0x123' }],
        texts: [],
        contentHash: '0xcontenthash',
      },
      reverseRecord: false,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(false)
  })

  it('should return false when there is a reverse record', () => {
    const params = {
      name: 'test',
      owner: '0x123',
      secret: '0x123',
      duration: 100,
      fuses: {
        named: [],
        unnamed: [],
      },
      records: {
        coins: [{ coin: 'eth', value: '0x123' }],
        texts: [],
        contentHash: '',
      },
      reverseRecord: true,
    } as RegistrationParameters
    expect(isLegacyRegistration(params)).toBe(false)
  })
})
