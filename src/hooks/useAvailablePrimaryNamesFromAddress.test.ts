import { renderHook } from '@app/test-utils'

import { useAvailablePrimaryNamesForAddress } from './useAvailablePrimaryNamesForAddress'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)

const MOCK_DATA: any[] = [
  /** * 2LD ** */
  // Owner - wrapped
  {
    expiryDate: '2024-02-25T19:01:50.000Z',
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
        CAN_DO_EVERYTHING: true,
        unnamed: {
          '64': false,
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
    isMigrated: true,
    parent: {
      name: 'eth',
      id: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
    },
    createdAt: '2023-02-25T19:01:50.000Z',
    registration: {
      expiryDate: '2024-02-25T19:01:50.000Z',
      registrationDate: '2023-02-25T19:01:50.000Z',
    },
    name: 'wrapped.eth',
    truncatedName: 'wrapped.eth',
    type: 'wrappedDomain',
    isController: false,
    isRegistrant: false,
    isWrappedOwner: true,
  },
  // Owner + Manager - unwrapped
  {
    id: '0xb760d28dc9b30ce4094506e71bc065c59902bfda967820af328f2d5638807581',
    labelName: 'test123',
    labelhash: '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad',
    isMigrated: true,
    parent: {
      name: 'eth',
      id: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
    },
    createdAt: null,
    registration: {
      expiryDate: '2023-10-30T18:47:30.000Z',
      registrationDate: '2022-10-30T18:47:30.000Z',
    },
    name: 'test123.eth',
    truncatedName: 'test123.eth',
    type: 'registration',
    isController: true,
    isRegistrant: true,
    isWrappedOwner: false,
    expiryDate: '2023-10-30T18:47:30.000Z',
    registrationDate: '2022-10-30T18:47:30.000Z',
  },
  // Manager - unwrapped
  {
    id: '0xdb9748144a7fbeb7e5d60b56276499a4034df1e337971245dce8efb3d0d462ba',
    labelName: 'other-registrant-2',
    labelhash: '0xd290ca736752d8c9094946444a3b0b0bf3826fa414b7ac9db07cd48609bd9799',
    isMigrated: true,
    parent: {
      name: 'eth',
      id: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
    },
    createdAt: '2022-10-30T18:47:30.000Z',
    registration: {
      expiryDate: '2023-10-30T18:47:30.000Z',
      registrationDate: '2022-10-30T18:47:30.000Z',
    },
    name: 'other-registrant-2.eth',
    truncatedName: 'other-registrant-2.eth',
    type: 'domain',
    isController: true,
    isRegistrant: false,
    isWrappedOwner: false,
    expiryDate: '2023-10-30T18:47:30.000Z',
  },
  // Owner - unwrapped
  {
    expiryDate: '2023-10-30T18:47:30.000Z',
    registrationDate: '2022-10-30T18:47:30.000Z',
    id: '0x37c512208e0cca38cffaf10e305393fed5bdd98d39a1426a72a25264728a0b5f',
    labelName: 'other-controller',
    labelhash: '0xdcda17d427ee6cfd36424dbe307ab88e7b8770e0f847db70a9331e5a3b49ba5b',
    name: 'other-controller.eth',
    isMigrated: true,
    parent: {
      name: 'eth',
      id: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
    },
    createdAt: null,
    truncatedName: 'other-controller.eth',
    type: 'registration',
    isController: false,
    isRegistrant: true,
    isWrappedOwner: false,
  },
  // Grace period - unwrapped
  {
    id: '0x3fcccdda6b58c02670b1b59a53a00d8880b8db93e0af3ae453e0d8464a10bbcf',
    labelName: 'grace-period',
    labelhash: '0x161eb1c32eb922bcd8b6786294cc9d21691cbaba354b2387585e2e6d8bd9273e',
    isMigrated: true,
    parent: {
      name: 'eth',
      id: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
    },
    createdAt: null,
    registration: {
      expiryDate: '2022-12-27T18:47:30.000Z',
      registrationDate: '2022-10-30T18:47:30.000Z',
    },
    name: 'grace-period.eth',
    truncatedName: 'grace-period.eth',
    type: 'registration',
    isController: true,
    isRegistrant: true,
    isWrappedOwner: false,
    expiryDate: '2022-12-27T18:47:30.000Z',
    registrationDate: '2022-10-30T18:47:30.000Z',
  },
  // Old Registry
  {
    id: '0xdf0199f0e5b76abd82fd2b1d8500498e75a8ff53d96449336e09493cd5e2c0f4',
    labelName: 'legacy',
    labelhash: '0xb7ccb6878fbded310d2d05350bca9c84568ecb568d4b626c83e0508c3193ce89',
    isMigrated: false,
    parent: {
      name: 'test',
      id: '0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6',
    },
    createdAt: '2022-10-30T18:45:45.000Z',
    registration: null,
    name: 'legacy.test',
    truncatedName: 'legacy.test',
    type: 'domain',
    isController: true,
    isRegistrant: false,
    isWrappedOwner: false,
  },
  /** * Subnames ** */
  {},
]

describe('useAvailablePrimaryNamesFromAddress', () => {
  it('should only return ', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAvailablePrimaryNamesForAddress({
        address: '0x123',
        sort: { type: 'labelName', orderDirection: 'asc' },
        page: 1,
        resultsPerPage: 10,
        search: '',
      }),
    )
  })
})
