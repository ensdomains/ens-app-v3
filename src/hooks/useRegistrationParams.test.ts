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
        "referrer": undefined,
        "resolverAddress": "0xresolver",
        "reverseRecord": 2,
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
        "referrer": undefined,
        "resolverAddress": "0xresolver",
        "reverseRecord": 2,
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
        "name": "test",
        "owner": "0xowner",
        "records": {
          "clearRecords": true,
        },
        "referrer": undefined,
        "resolverAddress": "0xresolver",
        "reverseRecord": 2,
        "secret": "0xsecret",
      }
    `)
  })

  it('should return reverseRecord set to 0 when reverseRecord is false', () => {
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
          reverseRecord: false,
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      {
        "duration": 31536000,
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
        "referrer": undefined,
        "resolverAddress": "0xresolver",
        "reverseRecord": 0,
        "secret": "0xsecret",
      }
    `)
  })

  it('should return referrer when it is set', () => {
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
          referrer: '0xreferrer',
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      {
        "duration": 31536000,
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
        "referrer": "0xreferrer",
        "resolverAddress": "0xresolver",
        "reverseRecord": 2,
        "secret": "0xsecret",
      }
    `)
  })
})
