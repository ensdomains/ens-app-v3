/* eslint-disable @typescript-eslint/naming-convention */
import { mockFunction, renderHook } from '@app/test-utils'

import { usePrimary } from '@app/hooks/usePrimary'

import { useNamesFromAddress } from '../useNamesFromAddress/useNamesFromAddress'
import { useNamesFromResolvedAddress } from '../useNamesFromResolvedAddress/useNamesFromResolvedAddress'
import {
  Name as BaseName,
  useAvailablePrimaryNamesForAddress,
} from './useAvailablePrimaryNamesForAddress'

type Name = BaseName & { shouldReturn?: boolean }

const MOCK_NAMES_FROM_ADDRESS: Name[] = [
  /** TLD */
  {
    id: '0xa097f6721ce401e757d1223a763fef49b8b5f90bb18567ddb86fd205dff71d34',
    labelName: 'tld',
    labelhash: '0xdec08c9dbbdd0890e300eb5062089b2d4b1c40e3673bbccb5423f7b37dcf9a9c',
    name: 'tld',
    isMigrated: true,
    parent: {
      name: '',
    },
    createdAt: new Date('2022-11-10T20:18:42.000Z'),
    truncatedName: 'reverse',
    type: 'domain',
    isController: true,
    isRegistrant: false,
    isWrappedOwner: true,
  },
  /** 2LDs */
  // unwrapped
  {
    id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
    labelName: 'unwrapped-unmigrated',
    labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
    name: 'unwrapped-unmigrated.eth',
    isMigrated: false,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T20:18:42.000Z'),
    registration: {
      expiryDate: new Date('2023-11-10T20:19:48.000Z'),
      registrationDate: new Date('2022-11-10T20:19:48.000Z'),
    },
    truncatedName: 'unwrapped-unmigrated.eth',
    type: 'registration',
    isController: true,
    isRegistrant: true,
    isWrappedOwner: true,
    expiryDate: new Date('2023-11-10T20:19:48.000Z'),
    registrationDate: new Date('2022-11-10T20:19:48.000Z'),
  },
  {
    id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
    labelName: 'unwrapped-expired',
    labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
    name: 'unwrapped-expired.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T20:18:42.000Z'),
    registration: {
      expiryDate: new Date('2023-11-10T20:19:48.000Z'),
      registrationDate: new Date('2022-11-10T20:19:48.000Z'),
    },
    truncatedName: 'unwrapped-expired.eth',
    type: 'registration',
    isController: true,
    isRegistrant: true,
    isWrappedOwner: true,
    expiryDate: new Date('2022-11-10T20:19:48.000Z'),
    registrationDate: new Date('2022-11-10T20:19:48.000Z'),
  },
  {
    id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
    labelName: 'unwrapped-manager',
    labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
    name: 'unwrapped-manager.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T20:18:42.000Z'),
    registration: {
      expiryDate: new Date('2023-11-10T20:19:48.000Z'),
      registrationDate: new Date('2022-11-10T20:19:48.000Z'),
    },
    truncatedName: 'unwrapped-manager.eth',
    type: 'registration',
    isController: true,
    isRegistrant: false,
    isWrappedOwner: false,
    expiryDate: new Date('2023-11-10T20:19:48.000Z'),
    registrationDate: new Date('2022-11-10T20:19:48.000Z'),
    shouldReturn: true,
  },
  {
    id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
    labelName: 'unwrapped-owner',
    labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
    name: 'unwrapped-owner.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T20:18:42.000Z'),
    registration: {
      expiryDate: new Date('2023-11-10T20:19:48.000Z'),
      registrationDate: new Date('2022-11-10T20:19:48.000Z'),
    },
    truncatedName: 'unwrapped-owner.eth',
    type: 'registration',
    isController: false,
    isRegistrant: true,
    isWrappedOwner: false,
    expiryDate: new Date('2023-11-10T20:19:48.000Z'),
    registrationDate: new Date('2022-11-10T20:19:48.000Z'),
  },
  // wrapped
  {
    expiryDate: new Date('2024-03-07T20:34:08.000Z'),
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
    createdAt: new Date('2023-03-08T20:34:08.000Z'),
    registration: {
      expiryDate: new Date('2024-03-07T20:34:08.000Z'),
      registrationDate: new Date('2023-03-08T20:34:08.000Z'),
    },
    truncatedName: 'wrapped.eth',
    type: 'wrappedDomain',
    isController: false,
    isRegistrant: false,
    isWrappedOwner: true,
    shouldReturn: true,
  },

  /** Subnames */
  // unwrapped
  {
    id: '0x2e6d0f22311dda1b056738341f9ef745372ff037c99e7a9bcf46765e880b8c4d',
    labelName: 'xyz',
    labelhash: '0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49',
    name: 'xyz.with-subnames.eth',
    isMigrated: true,
    parent: {
      name: 'with-subnames.eth',
    },
    createdAt: new Date('2022-11-10T20:19:49.000Z'),
    truncatedName: 'xyz.with-subnames.eth',
    type: 'domain',
    isController: true,
    isRegistrant: false,
    isWrappedOwner: false,
    shouldReturn: true,
  },
  {
    id: '0x2e6d0f22311dda1b056738341f9ef745372ff037c99e7a9bcf46765e880b8c4d',
    labelName: 'not-migrated',
    labelhash: '0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49',
    name: 'not-migrated.with-subnames.eth',
    isMigrated: false,
    parent: {
      name: 'with-subnames.eth',
    },
    createdAt: new Date('2022-11-10T20:19:49.000Z'),
    truncatedName: 'not-migrated.with-subnames.eth',
    type: 'domain',
    isController: true,
    isRegistrant: false,
    isWrappedOwner: false,
  },
  // wrapped
  {
    expiryDate: new Date('2023-08-02T19:10:55.000Z'),
    fuses: {
      parent: {
        PARENT_CANNOT_CONTROL: true,
        CAN_EXTEND_EXPIRY: false,
        IS_DOT_ETH: false,
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
    id: '0x0a8d5fef0710b3e9406e641e3a8b0e19167b3af415a413b57ae99ed774cae2ac',
    labelName: 'not-expired',
    labelhash: '0x79cb3761cfcafc2986beb6eee8d7f68bd52ba1fc3670c7c26b6a1cc1889f0ef7',
    name: 'not-expired.wrapped-with-subnames.eth',
    isMigrated: true,
    parent: {
      name: 'wrapped-with-subnames.eth',
    },
    createdAt: new Date('2023-03-08T20:34:09.000Z'),
    truncatedName: 'not-expired.wrapped-with-subnames.eth',
    type: 'wrappedDomain',
    isController: false,
    isRegistrant: false,
    isWrappedOwner: true,
    shouldReturn: true,
  },
]

const MOCK_NAMES_FROM_RESOLVED_ADDRESS: Name[] = [
  {
    id: '0xcc68de2eb388a44402f684b234f725a8cebc09382bdb89cd613b6ba898fee08b',
    labelName: 'resolved',
    labelhash: '0x7b59fa3ae433d72e0be93f61bdeac8122dac0576b2e9f2025c9d6e2561ee1d57',
    name: 'resolved.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T22:38:40.000Z'),
    owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    truncatedName: 'resolved.eth',
    type: 'domain',
    expiryDate: new Date('2023-11-10T22:38:40.000Z'),
    registrationDate: new Date('2022-11-10T22:38:40.000Z'),
    manager: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    isResolvedAddress: true,
    isController: false,
    isRegistrant: false,
    isWrappedOwner: false,
    shouldReturn: true,
  },
  {
    id: '0xcc68de2eb388a44402f684b234f725a8cebc09382bdb89cd613b6ba898fee08b',
    labelName: 'resolved-expired',
    labelhash: '0x7b59fa3ae433d72e0be93f61bdeac8122dac0576b2e9f2025c9d6e2561ee1d57',
    name: 'resolved-expired.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T22:38:40.000Z'),
    owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    truncatedName: 'resolved-expired.eth',
    type: 'domain',
    expiryDate: new Date('2022-11-10T22:38:40.000Z'),
    registrationDate: new Date('2022-11-10T22:38:40.000Z'),
    manager: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    isResolvedAddress: true,
    isController: false,
    isRegistrant: false,
    isWrappedOwner: false,
  },
  {
    id: '0xcc68de2eb388a44402f684b234f725a8cebc09382bdb89cd613b6ba898fee08b',
    labelName: 'resolved-not-migrated',
    labelhash: '0x7b59fa3ae433d72e0be93f61bdeac8122dac0576b2e9f2025c9d6e2561ee1d57',
    name: 'resolved-not-migrated.eth',
    isMigrated: false,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T22:38:40.000Z'),
    owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    truncatedName: 'resolved-not-migrated.eth',
    type: 'domain',
    expiryDate: new Date('2023-11-10T22:38:40.000Z'),
    registrationDate: new Date('2022-11-10T22:38:40.000Z'),
    manager: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    isResolvedAddress: true,
    isController: false,
    isRegistrant: false,
    isWrappedOwner: false,
  },
  {
    id: '0xcc68de2eb388a44402f684b234f725a8cebc09382bdb89cd613b6ba898fee08b',
    labelName: 'resolved-tld',
    labelhash: '0x7b59fa3ae433d72e0be93f61bdeac8122dac0576b2e9f2025c9d6e2561ee1d57',
    name: 'resolved-tld',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T22:38:40.000Z'),
    owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    truncatedName: 'resolved-tld',
    type: 'domain',
    expiryDate: new Date('2023-11-10T22:38:40.000Z'),
    registrationDate: new Date('2022-11-10T22:38:40.000Z'),
    manager: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    isResolvedAddress: true,
    isController: false,
    isRegistrant: false,
    isWrappedOwner: false,
  },
  {
    id: '0xcc68de2eb388a44402f684b234f725a8cebc09382bdb89cd613b6ba898fee08b',
    labelName: 'primary',
    labelhash: '0x7b59fa3ae433d72e0be93f61bdeac8122dac0576b2e9f2025c9d6e2561ee1d57',
    name: 'primary.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
    },
    createdAt: new Date('2022-11-10T22:38:40.000Z'),
    owner: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    truncatedName: 'primary.eth',
    type: 'domain',
    expiryDate: new Date('2023-11-10T22:38:40.000Z'),
    registrationDate: new Date('2022-11-10T22:38:40.000Z'),
    manager: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    isResolvedAddress: true,
    isController: true,
    isRegistrant: true,
    isWrappedOwner: true,
  },
]

jest.useFakeTimers().setSystemTime(new Date('2023-01-08T20:34:09.000Z'))

jest.mock('@app/hooks/usePrimary')
jest.mock('@app/hooks/names/useNamesFromAddress/useNamesFromAddress')
jest.mock('@app/hooks/names/useNamesFromResolvedAddress/useNamesFromResolvedAddress')

const mockUsePrimary = mockFunction(usePrimary)
const mockUseNamesFromAddress = mockFunction(useNamesFromAddress)
const mockUseNamesFromResolvedAddress = mockFunction(useNamesFromResolvedAddress)

mockUsePrimary.mockReturnValue({ data: { name: 'primary.eth' }, isLoading: false })
mockUseNamesFromAddress.mockReturnValue({
  data: { names: MOCK_NAMES_FROM_ADDRESS },
  isLoading: false,
})
mockUseNamesFromResolvedAddress.mockReturnValue({
  data: MOCK_NAMES_FROM_RESOLVED_ADDRESS,
  isLoading: false,
})

const RETURNED_NAMES = [...MOCK_NAMES_FROM_ADDRESS, ...MOCK_NAMES_FROM_RESOLVED_ADDRESS]
  .filter((n) => n.shouldReturn)
  .map((n) => n.name)
const NOT_RETURN_NAMES = [...MOCK_NAMES_FROM_ADDRESS, ...MOCK_NAMES_FROM_RESOLVED_ADDRESS]
  .filter((n) => !n.shouldReturn)
  .map((n) => n.name)

describe('useAvailablePrimaryNamesFromAddress', () => {
  it('should only return ', async () => {
    const { result } = renderHook(() =>
      useAvailablePrimaryNamesForAddress({
        address: '0x123',
        sort: { type: 'labelName', orderDirection: 'asc' },
        resultsPerPage: 'all',
        search: '',
      }),
    )
    expect(result.current.data?.pages[0].every((n) => RETURNED_NAMES.includes(n.name))).toBe(true)
    expect(result.current.data?.pages[0].every((n) => !NOT_RETURN_NAMES.includes(n.name))).toBe(
      true,
    )
  })
})
