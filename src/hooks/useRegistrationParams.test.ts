import { renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { yearsToSeconds } from '@app/utils/utils'

import useRegistrationParams from './useRegistrationParams'

describe('useRegistrationParams()', () => {
  it('should return correct default registration params', () => {
    const { result } = renderHook(() =>
      useRegistrationParams({
        name: 'test',
        owner: '0xowner',
        registrationData: {
          seconds: yearsToSeconds(1),
          resolverAddress: '0xresolver',
          secret: '0xsecret',
          records: [
            {
              key: 'eth',
              value: '0x4B2D639Ac1b0497e932F8ce234EFd3b3Df9a9b74',
              group: 'address',
              type: 'addr',
            },
          ],
          clearRecords: false,
          reverseRecord: true,
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      {
        "duration": 31536000,
        "fuses": {
          "named": [],
          "unnamed": [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": {
          "clearRecords": false,
          "coins": [
            {
              "coin": "eth",
              "value": "0x4B2D639Ac1b0497e932F8ce234EFd3b3Df9a9b74",
            },
          ],
        },
        "resolverAddress": "0xresolver",
        "reverseRecord": true,
        "secret": "0xsecret",
      }
    `)
  })
  it('should return correct registration params when records are set', () => {
    const { result } = renderHook(() =>
      useRegistrationParams({
        name: 'test',
        owner: '0xowner',
        registrationData: {
          seconds: yearsToSeconds(1),
          resolverAddress: '0xresolver',
          secret: '0xsecret',
          records: [
            {
              key: 'eth',
              value: '0x4B2D639Ac1b0497e932F8ce234EFd3b3Df9a9b74',
              group: 'address',
              type: 'addr',
            },
            {
              key: 'btc',
              value: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
              group: 'address',
              type: 'addr',
            },
            {
              key: 'description',
              value: 'This is a description',
              group: 'general',
              type: 'text',
            },
          ],
          clearRecords: false,
          reverseRecord: true,
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      {
        "duration": 31536000,
        "fuses": {
          "named": [],
          "unnamed": [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": {
          "clearRecords": false,
          "coins": [
            {
              "coin": "eth",
              "value": "0x4B2D639Ac1b0497e932F8ce234EFd3b3Df9a9b74",
            },
            {
              "coin": "btc",
              "value": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            },
          ],
          "texts": [
            {
              "key": "description",
              "value": "This is a description",
            },
          ],
        },
        "resolverAddress": "0xresolver",
        "reverseRecord": true,
        "secret": "0xsecret",
      }
    `)
  })
  it('should return correct registration params when clearRecords is true', () => {
    const { result } = renderHook(() =>
      useRegistrationParams({
        name: 'test',
        owner: '0xowner',
        registrationData: {
          seconds: yearsToSeconds(1),
          resolverAddress: '0xresolver',
          secret: '0xsecret',
          records: [],
          clearRecords: true,
          reverseRecord: true,
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      {
        "duration": 31536000,
        "fuses": {
          "named": [],
          "unnamed": [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": {
          "clearRecords": true,
        },
        "resolverAddress": "0xresolver",
        "reverseRecord": true,
        "secret": "0xsecret",
      }
    `)
  })
  it('should return correct registration params when permissions are set', () => {
    const { result } = renderHook(() =>
      useRegistrationParams({
        name: 'test',
        owner: '0xowner',
        registrationData: {
          seconds: yearsToSeconds(1),
          resolverAddress: '0xresolver',
          secret: '0xsecret',
          records: [],
          permissions: {
            CANNOT_APPROVE: false,
            CANNOT_BURN_FUSES: false,
            CANNOT_CREATE_SUBDOMAIN: false,
            CANNOT_SET_RESOLVER: false,
            CANNOT_SET_TTL: false,
            CANNOT_TRANSFER: false,
            CANNOT_UNWRAP: true,
          },
          clearRecords: false,
          reverseRecord: true,
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      {
        "duration": 31536000,
        "fuses": {
          "named": [
            "CANNOT_UNWRAP",
          ],
          "unnamed": [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": {
          "clearRecords": false,
        },
        "resolverAddress": "0xresolver",
        "reverseRecord": true,
        "secret": "0xsecret",
      }
    `)
  })
})
