import { Address } from 'viem'
import { describe, expect, it } from 'vitest'

import { GetNamesForAddressReturnType, NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { decodeFuses } from '@ensdomains/ensjs/utils'

import { removeStaleWrappedNameData } from './removeStaleWrappedNameData'

const nameWrapperAddress: Address = '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401'
const userAddress: Address = '0xF9e21eDb4DFc9FF648da6DED3864B79E626E578A'
const previousOwnerAddress: Address = '0xb6AccDb317341F8E20BF49FF2669C6C84E6C83c1'

const makeDate = (value: number) => ({ date: new Date(value), value })

const makeName = (overrides: Partial<NameWithRelation>): NameWithRelation => ({
  id: '0xdabae4fdae0eae84fe5e1851764eb0f9fbb6d95b38520b6759c51e90579b7328',
  name: 'test.eth',
  truncatedName: 'test.eth',
  labelName: 'test',
  labelhash: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
  isMigrated: true,
  parentName: 'eth',
  createdAt: makeDate(1600000000000),
  registrationDate: makeDate(1600000000000),
  expiryDate: makeDate(1900000000000),
  fuses: null,
  owner: userAddress,
  registrant: userAddress,
  wrappedOwner: null,
  resolvedAddress: null,
  relation: { owner: true, registrant: true },
  ...overrides,
})

// PARENT_CANNOT_CONTROL | IS_DOT_ETH - as emitted for a wrapped .eth 2LD
const wrappedEthFuses = decodeFuses(196608)

describe('removeStaleWrappedNameData', () => {
  it('should keep unwrapped names without wrapped data untouched', () => {
    const names: GetNamesForAddressReturnType = [makeName({})]
    expect(removeStaleWrappedNameData({ names, nameWrapperAddress })).toEqual(names)
  })

  it('should keep genuinely wrapped names untouched', () => {
    const names: GetNamesForAddressReturnType = [
      makeName({
        owner: nameWrapperAddress,
        registrant: nameWrapperAddress,
        wrappedOwner: userAddress,
        fuses: wrappedEthFuses,
        relation: { owner: false, registrant: false, wrappedOwner: true },
      }),
    ]
    expect(removeStaleWrappedNameData({ names, nameWrapperAddress })).toEqual(names)
  })

  it('should keep genuinely wrapped names untouched regardless of address casing', () => {
    const names: GetNamesForAddressReturnType = [
      makeName({
        owner: nameWrapperAddress.toLowerCase() as Address,
        wrappedOwner: userAddress,
        fuses: wrappedEthFuses,
        relation: { owner: false, registrant: false, wrappedOwner: true },
      }),
    ]
    expect(removeStaleWrappedNameData({ names, nameWrapperAddress })).toEqual(names)
  })

  it('should strip stale wrapped data from a re-registered unwrapped name', () => {
    // reflects theblackparade.eth from WEB-613: re-registered unwrapped by
    // userAddress, but the subgraph still holds the previous owner's WrappedDomain
    const names: GetNamesForAddressReturnType = [
      makeName({
        wrappedOwner: previousOwnerAddress,
        fuses: wrappedEthFuses,
        relation: { owner: true, registrant: true, wrappedOwner: false },
      }),
    ]
    const result = removeStaleWrappedNameData({ names, nameWrapperAddress })
    expect(result).toHaveLength(1)
    expect(result[0].fuses).toBeNull()
    expect(result[0].wrappedOwner).toBeNull()
    expect(result[0].relation).toEqual({ owner: true, registrant: true, wrappedOwner: false })
    // registration expiry is not stale and should be kept
    expect(result[0].expiryDate).toEqual(makeDate(1900000000000))
  })

  it('should strip stale wrapped data when registrant still owns an unwrapped name', () => {
    // reflects ucles.eth: registry owner/registrant is the user, but subgraph still
    // attaches a previous WrappedDomain (fuses + wrappedOwner)
    const names: GetNamesForAddressReturnType = [
      makeName({
        name: 'ucles.eth',
        truncatedName: 'ucles.eth',
        labelName: 'ucles',
        owner: userAddress,
        registrant: userAddress,
        wrappedOwner: previousOwnerAddress,
        fuses: wrappedEthFuses,
        relation: { owner: true, registrant: true, wrappedOwner: false },
      }),
    ]
    const result = removeStaleWrappedNameData({ names, nameWrapperAddress })
    expect(result).toHaveLength(1)
    expect(result[0].fuses).toBeNull()
    expect(result[0].wrappedOwner).toBeNull()
    expect(result[0].relation).toEqual({ owner: true, registrant: true, wrappedOwner: false })
  })

  it('should leave names unchanged when nameWrapperAddress is missing', () => {
    const names: GetNamesForAddressReturnType = [
      makeName({
        wrappedOwner: previousOwnerAddress,
        fuses: wrappedEthFuses,
        relation: { owner: true, registrant: true, wrappedOwner: false },
      }),
    ]
    expect(removeStaleWrappedNameData({ names, nameWrapperAddress: undefined })).toEqual(names)
  })

  it('should remove names whose only relation to the address is a stale wrapped owner', () => {
    // the previous owner's name list should no longer include the name
    const names: GetNamesForAddressReturnType = [
      makeName({
        wrappedOwner: previousOwnerAddress,
        fuses: wrappedEthFuses,
        relation: { owner: false, registrant: false, wrappedOwner: true },
      }),
    ]
    expect(removeStaleWrappedNameData({ names, nameWrapperAddress })).toEqual([])
  })

  it('should keep names with a stale wrapped owner if another relation exists', () => {
    const names: GetNamesForAddressReturnType = [
      makeName({
        wrappedOwner: previousOwnerAddress,
        fuses: wrappedEthFuses,
        relation: { owner: false, registrant: false, wrappedOwner: true, resolvedAddress: true },
      }),
    ]
    const result = removeStaleWrappedNameData({ names, nameWrapperAddress })
    expect(result).toHaveLength(1)
    expect(result[0].relation.wrappedOwner).toBe(false)
    expect(result[0].relation.resolvedAddress).toBe(true)
  })

  it('should null the expiry date of a stale wrapped name without a registration', () => {
    // e.g. a previously wrapped subname - its expiry could only have come from
    // the stale WrappedDomain entity
    const names: GetNamesForAddressReturnType = [
      makeName({
        name: 'sub.test.eth',
        parentName: 'test.eth',
        registrationDate: null,
        registrant: null,
        expiryDate: makeDate(1700000000000),
        wrappedOwner: previousOwnerAddress,
        fuses: wrappedEthFuses,
        relation: { owner: true, wrappedOwner: false },
      }),
    ]
    const result = removeStaleWrappedNameData({ names, nameWrapperAddress })
    expect(result).toHaveLength(1)
    expect(result[0].expiryDate).toBeNull()
  })
})
