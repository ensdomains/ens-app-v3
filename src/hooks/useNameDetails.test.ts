import { mockFunction, renderHook } from '@app/test-utils'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDnsOwner } from './ensjs/dns/useDnsOwner'
import { useBasicName } from './useBasicName'
import { useNameDetails } from './useNameDetails'
import { useProfile } from './useProfile'
import { match } from 'ts-pattern'

vi.mock('./useBasicName')
vi.mock('./useProfile')
vi.mock('./ensjs/dns/useDnsOwner')

const mockUseBasicName = mockFunction(useBasicName)
const mockUseProfile = mockFunction(useProfile)
const mockUseDnsOwner = mockFunction(useDnsOwner)

describe('useNameDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProfile.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
    mockUseDnsOwner.mockReturnValue({
      data: undefined,
      isLoading: false,
    })
  })
  it('should return an error message for an invalid name', () => {
    mockUseBasicName.mockReturnValue({
      isValid: false,
      name: 'invalid',
    })

    const { result } = renderHook(() => useNameDetails({ name: 'invalid' }))
    expect(result.current.error).toEqual('errors.invalidName')
  })
  it('should not enable useProfile when normalisedName is [root]', () => {
    mockUseBasicName.mockReturnValue({
      isValid: true,
      name: '[root]',
      normalisedName: '[root]',
    })
    renderHook(() => useNameDetails({ name: '[root]' }))
    expect(mockUseProfile).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }))
  })
})

const mockUseNameDetailsConfig = {
  'eth-available-name': { name: 'available.eth'},
  'eth-emancipated-2ld': { name: 'eth-emanicipated.eth'},
  'eth-unwrapped-2ld': { name: '',}
}

type MockUseNameDetailsType = keyof typeof mockUseNameDetailsConfig
const mockUseNameDetailsTypes = Object.keys(mockUseNameDetailsConfig) as MockUseNameDetailsType[]

const makeMockUseNameDetailsData = (type: MockUseNameDetailsType) => {
  const config = mockUseNameDetailsConfig[type]
  const {name} = config
  return match(type)
.with('eth-available-name', () => ({
  "error": null,
  "normalisedName": "available.eth",
  "isValid": true,
  "profile": {
      "texts": [],
      "coins": [],
      "contentHash": null,
      "abi": null,
      "resolverAddress": "0x0000000000000000000000000000000000000000"
  },
  "isLoading": false,
  "isCachedData": false,
  "registrationStatus": "available",
  "type": "name",
  "isShort": false,
  "is2LD": true,
  "isETH": true,
  "labelDataArray": [
      {
          "input": [
              117,
              110,
              119,
              114,
              97,
              112,
              116,
              101,
              115,
              116
          ],
          "offset": 0,
          "tokens": [
              [
                  117,
                  110,
                  119,
                  114,
                  97,
                  112,
                  116,
                  101,
                  115,
                  116
              ]
          ],
          "type": "ASCII",
          "output": [
              117,
              110,
              119,
              114,
              97,
              112,
              116,
              101,
              115,
              116
          ]
      },
      {
          "input": [
              101,
              116,
              104
          ],
          "offset": 11,
          "tokens": [
              [
                  101,
                  116,
                  104
              ]
          ],
          "type": "ASCII",
          "output": [
              101,
              116,
              104
          ]
      }
  ],
  "name": "available.eth",
  "beautifiedName": "available.eth",
  "isNonASCII": false,
  "labelCount": 2,
  "wrapperData": null,
  "priceData": {
      "base": "3203936997786453",
      "premium": "0"
  },
  "truncatedName": "available.eth",
  "isWrapped": false,
  "pccExpired": false,
  "canBeWrapped": true
}))
.with('eth-emancipated-2ld', () => ({
  "error": null,
  "normalisedName": "unwraptest.eth",
  "isValid": true,
  "profile": {
      "texts": [],
      "coins": [
          {
              "id": 60,
              "name": "eth",
              "value": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
          }
      ],
      "contentHash": null,
      "abi": null,
      "resolverAddress": "0x1291Be112d480055DaFd8a610b7d1e203891C274",
      "isMigrated": true,
      "createdAt": {
          "date": "2024-03-01T02:41:18.000Z",
          "value": 1709260878000
      },
      "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  },
  "isLoading": false,
  "isCachedData": false,
  "registrationStatus": "registered",
  "gracePeriodEndDate": "2027-05-30T02:41:18.000Z",
  "expiryDate": "2027-03-01T02:41:18.000Z",
  "type": "name",
  "isShort": false,
  "is2LD": true,
  "isETH": true,
  "labelDataArray": [
      {
          "input": [
              117,
              110,
              119,
              114,
              97,
              112,
              116,
              101,
              115,
              116
          ],
          "offset": 0,
          "tokens": [
              [
                  117,
                  110,
                  119,
                  114,
                  97,
                  112,
                  116,
                  101,
                  115,
                  116
              ]
          ],
          "type": "ASCII",
          "output": [
              117,
              110,
              119,
              114,
              97,
              112,
              116,
              101,
              115,
              116
          ]
      },
      {
          "input": [
              101,
              116,
              104
          ],
          "offset": 11,
          "tokens": [
              [
                  101,
                  116,
                  104
              ]
          ],
          "type": "ASCII",
          "output": [
              101,
              116,
              104
          ]
      }
  ],
  "name": "unwraptest.eth",
  "beautifiedName": "unwraptest.eth",
  "isNonASCII": false,
  "labelCount": 2,
  "ownerData": {
      "owner": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "ownershipLevel": "nameWrapper"
  },
  "wrapperData": {
      "fuses": {
          "parent": {
              "PARENT_CANNOT_CONTROL": true,
              "CAN_EXTEND_EXPIRY": false,
              "IS_DOT_ETH": true,
              "unnamed": {
                  "0x80000": false,
                  "0x100000": false,
                  "0x200000": false,
                  "0x400000": false,
                  "0x800000": false,
                  "0x1000000": false
              }
          },
          "child": {
              "CANNOT_UNWRAP": false,
              "CANNOT_BURN_FUSES": false,
              "CANNOT_TRANSFER": false,
              "CANNOT_SET_RESOLVER": false,
              "CANNOT_SET_TTL": false,
              "CANNOT_CREATE_SUBDOMAIN": false,
              "CANNOT_APPROVE": false,
              "unnamed": {
                  "0x80": false,
                  "0x100": false,
                  "0x200": false,
                  "0x400": false,
                  "0x800": false,
                  "0x1000": false,
                  "0x2000": false,
                  "0x4000": false,
                  "0x8000": false
              },
              "CAN_DO_EVERYTHING": true
          },
          "value": 196608
      },
      "expiry": {
          "date": "2027-05-30T02:41:18.000Z",
          "value": "1811644878"
      },
      "owner": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  },
  "priceData": {
      "base": "3203936997786453",
      "premium": "0"
  },
  "truncatedName": "unwraptest.eth",
  "isWrapped": true,
  "pccExpired": false,
  "canBeWrapped": false
}))
.with('eth-unwrapped-2ld', () => ({
    "error": null,
    "normalisedName": "unwraptest.eth",
    "isValid": true,
    "profile": {
        "texts": [],
        "coins": [
            {
                "id": 60,
                "name": "eth",
                "value": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            }
        ],
        "contentHash": null,
        "abi": null,
        "resolverAddress": "0x1291Be112d480055DaFd8a610b7d1e203891C274",
        "isMigrated": true,
        "createdAt": {
            "date": "2024-03-01T02:41:18.000Z",
            "value": 1709260878000
        },
        "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    },
    "isLoading": false,
    "isCachedData": false,
    "registrationStatus": "registered",
    "gracePeriodEndDate": "2027-05-30T02:41:18.000Z",
    "expiryDate": "2027-03-01T02:41:18.000Z",
    "type": "name",
    "isShort": false,
    "is2LD": true,
    "isETH": true,
    "labelDataArray": [
        {
            "input": [
                117,
                110,
                119,
                114,
                97,
                112,
                116,
                101,
                115,
                116
            ],
            "offset": 0,
            "tokens": [
                [
                    117,
                    110,
                    119,
                    114,
                    97,
                    112,
                    116,
                    101,
                    115,
                    116
                ]
            ],
            "type": "ASCII",
            "output": [
                117,
                110,
                119,
                114,
                97,
                112,
                116,
                101,
                115,
                116
            ]
        },
        {
            "input": [
                101,
                116,
                104
            ],
            "offset": 11,
            "tokens": [
                [
                    101,
                    116,
                    104
                ]
            ],
            "type": "ASCII",
            "output": [
                101,
                116,
                104
            ]
        }
    ],
    "name": "unwraptest.eth",
    "beautifiedName": "unwraptest.eth",
    "isNonASCII": false,
    "labelCount": 2,
    "ownerData": {
        "registrant": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "owner": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "ownershipLevel": "registrar"
    },
    "wrapperData": null,
    "priceData": {
        "base": "3203936997786453",
        "premium": "0"
    },
    "truncatedName": "unwraptest.eth",
    "isWrapped": false,
    "pccExpired": false,
    "canBeWrapped": true
}))
.exhaustive()}