/* eslint-disable @typescript-eslint/naming-convention */
import { GRACE_PERIOD } from '@app/utils/constants'

import { filterBySearch, filterByType, isValidName, mergeNames, sortByType } from './utils'

describe('mergeNames', () => {
  it('should merge names correctly', () => {
    expect(
      mergeNames([
        {
          expiryDate: new Date('2024-01-14T18:37:56.000Z'),
          registrationDate: new Date('2023-01-14T18:37:56.000Z'),
          id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
          labelName: 'test123',
          labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
          name: 'test123.eth',
          isMigrated: true,
          parent: {
            name: 'eth',
          },
          createdAt: new Date('2023-01-14T18:37:56.000Z'),
          truncatedName: 'test123.eth',
          type: 'registration',
        },
        {
          id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
          labelName: 'test123',
          labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
          name: 'test123.eth',
          isMigrated: true,
          parent: {
            name: 'eth',
          },
          createdAt: new Date('2023-01-14T18:37:56.000Z'),
          registration: {
            expiryDate: new Date('2024-01-14T18:37:56.000Z'),
            registrationDate: new Date('2023-01-14T18:37:56.000Z'),
          },
          truncatedName: 'test123.eth',
          type: 'domain',
        },
        {
          expiryDate: new Date('2024-08-09T18:52:16.000Z'),
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
              CAN_EXTEND_EXPIRY: false,
              IS_DOT_ETH: true,
              unnamed: {
                '524288': false,
                '1048576': false,
                '2097152': false,
                '4194304': false,
                '8388608': false,
                '16777216': false,
                '33554432': false,
                '67108864': false,
                '134217728': false,
                '268435456': false,
                '536870912': false,
                '1073741824': false,
                '2147483648': false,
              },
            },
            child: {
              CANNOT_UNWRAP: false,
              CANNOT_BURN_FUSES: false,
              CANNOT_TRANSFER: false,
              CANNOT_SET_RESOLVER: false,
              CANNOT_SET_TTL: false,
              CANNOT_CREATE_SUBDOMAIN: false,
              CANNOT_APPROVE: false,
              CAN_DO_EVERYTHING: true,
              unnamed: {
                '128': false,
                '256': false,
                '512': false,
                '1024': false,
                '2048': false,
                '4096': false,
                '8192': false,
                '16384': false,
                '32768': false,
              },
            },
          },
          id: '0x4b162e8ef5a976a025f29a8308523ae94e4f248a0db2d87addd10ce0ec703d84',
          labelName: 'wrapped',
          labelhash: '0x4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b',
          name: 'wrapped.eth',
          isMigrated: true,
          parent: {
            name: 'eth',
          },
          createdAt: new Date('2023-05-12T18:52:16.000Z'),
          registration: {
            expiryDate: new Date('2024-05-11T18:52:16.000Z'),
            registrationDate: new Date('2023-05-12T18:52:16.000Z'),
          },
          truncatedName: 'wrapped.eth',
          type: 'wrappedDomain',
        },
      ]),
    ).toEqual([
      {
        createdAt: new Date('2023-01-14T18:37:56.000Z'),
        expiryDate: new Date('2024-01-14T18:37:56.000Z'),
        id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
        isController: true,
        isMigrated: true,
        isRegistrant: true,
        isWrappedOwner: false,
        labelName: 'test123',
        labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
        name: 'test123.eth',
        parent: {
          name: 'eth',
        },
        registration: {
          expiryDate: new Date('2024-01-14T18:37:56.000Z'),
          registrationDate: new Date('2023-01-14T18:37:56.000Z'),
        },
        registrationDate: new Date('2023-01-14T18:37:56.000Z'),
        truncatedName: 'test123.eth',
        type: 'domain',
      },
      {
        createdAt: new Date('2023-05-12T18:52:16.000Z'),
        expiryDate: new Date('2024-05-11T18:52:16.000Z'),
        fuses: {
          child: {
            CANNOT_APPROVE: false,
            CANNOT_BURN_FUSES: false,
            CANNOT_CREATE_SUBDOMAIN: false,
            CANNOT_SET_RESOLVER: false,
            CANNOT_SET_TTL: false,
            CANNOT_TRANSFER: false,
            CANNOT_UNWRAP: false,
            CAN_DO_EVERYTHING: true,
            unnamed: {
              '1024': false,
              '128': false,
              '16384': false,
              '2048': false,
              '256': false,
              '32768': false,
              '4096': false,
              '512': false,
              '8192': false,
            },
          },
          parent: {
            CAN_EXTEND_EXPIRY: false,
            IS_DOT_ETH: true,
            PARENT_CANNOT_CONTROL: true,
            unnamed: {
              '1048576': false,
              '1073741824': false,
              '134217728': false,
              '16777216': false,
              '2097152': false,
              '2147483648': false,
              '268435456': false,
              '33554432': false,
              '4194304': false,
              '524288': false,
              '536870912': false,
              '67108864': false,
              '8388608': false,
            },
          },
        },
        id: '0x4b162e8ef5a976a025f29a8308523ae94e4f248a0db2d87addd10ce0ec703d84',
        isController: false,
        isMigrated: true,
        isRegistrant: false,
        isWrappedOwner: true,
        labelName: 'wrapped',
        labelhash: '0x4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b',
        name: 'wrapped.eth',
        parent: {
          name: 'eth',
        },
        registration: {
          expiryDate: new Date('2024-05-11T18:52:16.000Z'),
          registrationDate: new Date('2023-05-12T18:52:16.000Z'),
        },
        truncatedName: 'wrapped.eth',
        type: 'wrappedDomain',
      },
    ])
  })
})

describe('isValidName', () => {
  it('should filter out if parent is addr.reverse', () => {
    expect(
      isValidName(100)({
        name: 'test.eth',
        parent: {
          name: 'addr.reverse',
        },
      } as any),
    ).toBe(false)
  })

  it('should filter out if parent is addr.reverse', () => {
    expect(
      isValidName(GRACE_PERIOD + 1)({
        name: 'test.eth',
        expiryDate: new Date(0),
      } as any),
    ).toBe(false)
  })

  it('should accept empty name object', () => {
    expect(isValidName(100)({} as any)).toBe(true)
  })
})

describe('filterByType', () => {
  it('should return false for any empty objects with type', () => {
    expect(filterByType('registration')({} as any)).toEqual(false)
    expect(filterByType('domain')({} as any)).toEqual(false)
    expect(filterByType('wrappedDomain')({} as any)).toEqual(false)
  })

  it('should return true for any objects with type', () => {
    expect(filterByType('registration')({ isRegistrant: true } as any)).toEqual(true)
    expect(filterByType('domain')({ isController: true } as any)).toEqual(true)
    expect(filterByType('wrappedDomain')({ isWrappedOwner: true } as any)).toEqual(true)
  })
})

describe('filterBySearch', () => {
  it('should return true if search is empty', () => {
    expect(filterBySearch('')({} as any)).toEqual(true)
  })

  it('should return true if search is in name', () => {
    expect(filterBySearch('test')({ name: 'asdasdftestkdjdkdjd.eth' } as any)).toEqual(true)
  })

  it('should return false if search is in not in name', () => {
    expect(filterBySearch('test')({ name: 'asdasdfkdjdkdjd.eth' } as any)).toEqual(false)
  })
})

describe('sortByType', () => {
  it('should sort correctly by labelName asc', () => {
    expect(
      sortByType('labelName', 'asc')({ truncatedName: 'a' } as any, { truncatedName: 'b' } as any),
    ).toEqual(-1)
    expect(
      sortByType('labelName', 'asc')({ truncatedName: 'b' } as any, { truncatedName: 'a' } as any),
    ).toEqual(1)
  })

  it('should sort correctly by labelName desc', () => {
    expect(
      sortByType('labelName', 'desc')({ truncatedName: 'a' } as any, { truncatedName: 'b' } as any),
    ).toEqual(1)
    expect(
      sortByType('labelName', 'desc')({ truncatedName: 'b' } as any, { truncatedName: 'a' } as any),
    ).toEqual(-1)
  })

  it('should sort correctly by creationDate asc', () => {
    expect(
      sortByType('creationDate', 'asc')(
        { createdAt: new Date(1) } as any,
        { createdAt: new Date(2) } as any,
      ),
    ).toBe(-1)
    expect(
      sortByType('creationDate', 'asc')(
        { createdAt: new Date(2) } as any,
        { createdAt: new Date(1) } as any,
      ),
    ).toBe(1)
  })

  it('should sort correctly by createdDate desc', () => {
    expect(
      sortByType('creationDate', 'desc')(
        { createdAt: new Date(1) } as any,
        { createdAt: new Date(2) } as any,
      ),
    ).toBe(1)
    expect(
      sortByType('creationDate', 'desc')(
        { createdAt: new Date(2) } as any,
        { createdAt: new Date(1) } as any,
      ),
    ).toBe(-1)
  })

  it('should sort correctly by expiryDate asc', () => {
    expect(
      sortByType('expiryDate', 'asc')(
        { expiryDate: new Date(1) } as any,
        { expiryDate: new Date(2) } as any,
      ),
    ).toBe(-1)
    expect(
      sortByType('expiryDate', 'asc')(
        { expiryDate: new Date(2) } as any,
        { expiryDate: new Date(1) } as any,
      ),
    ).toBe(1)
  })

  it('should sort correctly by expiryDate desc', () => {
    expect(
      sortByType('expiryDate', 'desc')(
        { expiryDate: new Date(1) } as any,
        { expiryDate: new Date(2) } as any,
      ),
    ).toBe(1)
    expect(
      sortByType('expiryDate', 'desc')(
        { expiryDate: new Date(2) } as any,
        { expiryDate: new Date(1) } as any,
      ),
    ).toBe(-1)
  })
})
