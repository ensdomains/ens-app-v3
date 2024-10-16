import { Address } from 'viem'
import { describe, expect, it } from 'vitest'

import { GetOwnerReturnType, GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { RegistrationStatus } from '@app/utils/registrationStatus'

import { getNameType } from './getNameType'

describe('getNameType', () => {
  const mockNameWrapperAddress: Address = '0x1234567890123456789012345678901234567890'

  it('should return "root" for [root]', () => {
    const result = getNameType({
      name: '[root]',
      ownerData: undefined,
      wrapperData: undefined,
      pccExpired: false,
      registrationStatus: undefined,
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('root')
  })

  it('should return "tld" for .eth', () => {
    const result = getNameType({
      name: 'eth',
      ownerData: undefined,
      wrapperData: undefined,
      pccExpired: false,
      registrationStatus: undefined,
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('tld')
  })

  it('should return "eth-unwrapped-2ld" for an unwrapped .eth 2LD', () => {
    const result = getNameType({
      name: 'test.eth',
      ownerData: { ownershipLevel: 'registry' } as GetOwnerReturnType,
      wrapperData: undefined,
      pccExpired: false,
      registrationStatus: 'registered',
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-unwrapped-2ld')
  })

  it('should return "eth-wrapped-2ld" for a wrapped .eth 2LD', () => {
    const result = getNameType({
      name: 'test.eth',
      ownerData: { ownershipLevel: 'nameWrapper' } as GetOwnerReturnType,
      wrapperData: { fuses: { child: {}, parent: {} } } as GetWrapperDataReturnType,
      pccExpired: false,
      registrationStatus: 'registered',
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-wrapped-2ld')
  })

  it('should return "eth-locked-2ld" for a locked .eth 2LD', () => {
    const result = getNameType({
      name: 'test.eth',
      ownerData: { ownershipLevel: 'nameWrapper' } as GetOwnerReturnType,
      wrapperData: {
        fuses: { child: { CANNOT_UNWRAP: true }, parent: {} },
      } as GetWrapperDataReturnType,
      pccExpired: false,
      registrationStatus: 'registered',
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-locked-2ld')
  })

  it('should return "eth-emancipated-2ld" for an emancipated .eth 2LD', () => {
    const result = getNameType({
      name: 'test.eth',
      ownerData: { ownershipLevel: 'nameWrapper' } as GetOwnerReturnType,
      wrapperData: {
        fuses: { child: {}, parent: { PARENT_CANNOT_CONTROL: true } },
      } as GetWrapperDataReturnType,
      pccExpired: false,
      registrationStatus: 'registered',
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-emancipated-2ld')
  })

  it('should return "eth-unwrapped-2ld:grace-period" for an unwrapped .eth 2LD in grace period', () => {
    const result = getNameType({
      name: 'test.eth',
      ownerData: { owner: '0x1234567890123456789012345678901234567890' } as GetOwnerReturnType,
      wrapperData: undefined,
      pccExpired: false,
      registrationStatus: 'gracePeriod',
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-unwrapped-2ld:grace-period')
  })

  it('should return "eth-wrapped-subname" for a wrapped .eth subname', () => {
    const result = getNameType({
      name: 'sub.test.eth',
      ownerData: { ownershipLevel: 'nameWrapper' } as GetOwnerReturnType,
      wrapperData: { fuses: { child: {}, parent: {} } } as GetWrapperDataReturnType,
      pccExpired: false,
      registrationStatus: undefined,
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-wrapped-subname')
  })

  it('should return "eth-pcc-expired-subname" for an expired PCC .eth subname', () => {
    const result = getNameType({
      name: 'sub.test.eth',
      ownerData: { ownershipLevel: 'nameWrapper' } as GetOwnerReturnType,
      wrapperData: { fuses: { child: {}, parent: {} } } as GetWrapperDataReturnType,
      pccExpired: true,
      registrationStatus: undefined,
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('eth-pcc-expired-subname')
  })

  it('should return "dns-unwrapped-2ld" for an unwrapped DNS 2LD', () => {
    const result = getNameType({
      name: 'test.com',
      ownerData: { ownershipLevel: 'registry' } as GetOwnerReturnType,
      wrapperData: undefined,
      pccExpired: false,
      registrationStatus: undefined,
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('dns-unwrapped-2ld')
  })

  it('should return "dns-wrapped-subname" for a wrapped DNS subname', () => {
    const result = getNameType({
      name: 'sub.test.com',
      ownerData: { ownershipLevel: 'nameWrapper' } as GetOwnerReturnType,
      wrapperData: { fuses: { child: {}, parent: {} } } as GetWrapperDataReturnType,
      pccExpired: false,
      registrationStatus: undefined,
      nameWrapperAddress: mockNameWrapperAddress,
    })
    expect(result).toBe('dns-wrapped-subname')
  })
})
