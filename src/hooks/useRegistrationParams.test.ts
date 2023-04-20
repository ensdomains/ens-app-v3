import { renderHook } from '@app/test-utils'

import useRegistrationParams from './useRegistrationParams'

describe('useRegistrationParams()', () => {
  it('should return correct default registration params', () => {
    const { result } = renderHook(() =>
      useRegistrationParams({
        name: 'test',
        owner: '0xowner',
        registrationData: {
          years: 1,
          resolver: '0xresolver',
          secret: '0xsecret',
          records: [
            {
              key: 'ETH',
              value: '0x4b2d639aC1B0497e932F8cE234eFd3B3Df9a9B74',
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
      Object {
        "duration": 31536000,
        "fuses": Object {
          "named": Array [],
          "unnamed": Array [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": Object {
          "clearRecords": false,
          "coinTypes": Array [
            Object {
              "key": "ETH",
              "value": "0x4b2d639aC1B0497e932F8cE234eFd3B3Df9a9B74",
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
          years: 1,
          resolver: '0xresolver',
          secret: '0xsecret',
          records: [
            {
              key: 'ETH',
              value: '0x4b2d639aC1B0497e932F8cE234eFd3B3Df9a9B74',
              group: 'address',
              type: 'addr',
            },
            {
              key: 'BTC',
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
      Object {
        "duration": 31536000,
        "fuses": Object {
          "named": Array [],
          "unnamed": Array [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": Object {
          "clearRecords": false,
          "coinTypes": Array [
            Object {
              "key": "ETH",
              "value": "0x4b2d639aC1B0497e932F8cE234eFd3B3Df9a9B74",
            },
            Object {
              "key": "BTC",
              "value": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
            },
          ],
          "texts": Array [
            Object {
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
          years: 1,
          resolver: '0xresolver',
          secret: '0xsecret',
          records: [],
          clearRecords: true,
          reverseRecord: true,
        },
      }),
    )
    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "duration": 31536000,
        "fuses": Object {
          "named": Array [],
          "unnamed": Array [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": Object {
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
          years: 1,
          resolver: '0xresolver',
          secret: '0xsecret',
          records: [],
          permissions: {
            CAN_DO_EVERYTHING: false,
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
      Object {
        "duration": 31536000,
        "fuses": Object {
          "named": Array [
            "CANNOT_UNWRAP",
          ],
          "unnamed": Array [],
        },
        "name": "test",
        "owner": "0xowner",
        "records": Object {
          "clearRecords": false,
        },
        "resolverAddress": "0xresolver",
        "reverseRecord": true,
        "secret": "0xsecret",
      }
    `)
  })
})
