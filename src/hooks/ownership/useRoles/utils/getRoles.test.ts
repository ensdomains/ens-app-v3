import { describe, expect, it } from 'vitest'

import { getRoles } from './getRoles'

describe('getRoles', () => {
  it('should return a list of roles', () => {
    expect(
      getRoles({
        nameType: 'eth-unwrapped-2ld',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        dnsOwner: '0xdnsOwner',
      }),
    ).toEqual([
      { address: '0xregistrant', role: 'owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return a list of roles for a wrapped 2LD', () => {
    expect(
      getRoles({
        nameType: 'eth-desynced-2ld',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
      }),
    ).toEqual([
      { address: '0xowner', role: 'owner' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return a list of roles for an unwrapped 2LD', () => {
    expect(
      getRoles({
        nameType: 'eth-unwrapped-2ld',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
      }),
    ).toEqual([
      { address: '0xregistrant', role: 'owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for an emancipated 2LD', () => {
    expect(
      getRoles({
        nameType: 'eth-emancipated-2ld',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
      }),
    ).toEqual([
      { address: '0xowner', role: 'owner' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a locked 2LD', () => {
    expect(
      getRoles({
        nameType: 'eth-locked-2ld',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
      }),
    ).toEqual([
      { address: '0xowner', role: 'owner' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return a list of roles for a subname', () => {
    expect(
      getRoles({
        nameType: 'eth-unwrapped-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xparentWrapperOwner', role: 'parent-owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a wrapped subname', () => {
    expect(
      getRoles({
        nameType: 'eth-wrapped-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xparentWrapperOwner', role: 'parent-owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a pcc expired subname', () => {
    expect(
      getRoles({
        nameType: 'eth-pcc-expired-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xparentWrapperOwner', role: 'parent-owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a dns subname', () => {
    expect(
      getRoles({
        nameType: 'dns-unwrapped-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xparentWrapperOwner', role: 'parent-owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a dns wrapped subname', () => {
    expect(
      getRoles({
        nameType: 'dns-wrapped-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xparentWrapperOwner', role: 'parent-owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a dns emancipated subname', () => {
    expect(
      getRoles({
        nameType: 'dns-emancipated-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xowner', role: 'owner' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a dns locked subname', () => {
    expect(
      getRoles({
        nameType: 'dns-locked-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xowner', role: 'owner' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an list of roles for a dns pcc expired subname', () => {
    expect(
      getRoles({
        nameType: 'dns-pcc-expired-subname',
        registrant: '0xregistrant',
        owner: '0xowner',
        ethAddress: '0xethAddress',
        parentOwner: '0xparentOwner',
        parentWrapperOwner: '0xparentWrapperOwner',
      }),
    ).toEqual([
      { address: '0xparentWrapperOwner', role: 'parent-owner' },
      { address: '0xowner', role: 'manager' },
      { address: '0xethAddress', role: 'eth-record' },
    ])
  })

  it('should return an empty list of roles for a tld', () => {
    expect(
      getRoles({
        nameType: 'tld',
      }),
    ).toEqual([])
  })

  it('should return an empty list of roles for a root', () => {
    expect(
      getRoles({
        nameType: 'root',
      }),
    ).toEqual([])
  })

  it('should return an empty list of roles for a nullish', () => {
    expect(
      getRoles({
        nameType: undefined,
      }),
    ).toEqual([])
  })
})
