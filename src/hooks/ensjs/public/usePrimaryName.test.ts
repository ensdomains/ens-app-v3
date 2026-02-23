import { mockFunction } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { getAddressRecord, getName } from '@ensdomains/ensjs/public'

import { ClientWithEns, ConfigWithEns } from '@app/types'

import { getPrimaryNameQueryFn } from './usePrimaryName'

vi.mock('@ensdomains/ensjs/public')

const mockGetName = mockFunction(getName)
const mockGetAddressRecord = mockFunction(getAddressRecord)

const address = '0xaddress'
const chainId = 1

const mockClient = {
  chain: {
    id: chainId,
  },
} as unknown as ClientWithEns
const mockConfig = {
  getClient: () => mockClient,
} as unknown as ConfigWithEns

describe('getPrimaryNameQueryFn', () => {
  it('should call getName', async () => {
    mockGetName.mockImplementationOnce(() => Promise.resolve({}))
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: false }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(mockGetName).toHaveBeenCalledWith(
      expect.objectContaining({ chain: expect.objectContaining({ id: chainId }) }),
      { address, allowMismatch: false },
    )
  })
  it('should return name when name is returned and matches', async () => {
    mockGetName.mockImplementationOnce(() =>
      Promise.resolve({
        name: 'test.eth',
        match: true,
        resolverAddress: '0xresolver',
        reverseResolverAddress: '0xreverseResolver',
      }),
    )
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: false }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "beautifiedName": "test.eth",
        "match": true,
        "name": "test.eth",
        "originalName": "test.eth",
        "resolverAddress": "0xresolver",
        "reverseResolverAddress": "0xreverseResolver",
      }
    `)
  })
  it('should return null when no name is returned', async () => {
    mockGetName.mockImplementationOnce(() => Promise.resolve(null))
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: false }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toBeNull()
  })
  it('should return null when name does not match', async () => {
    mockGetName.mockImplementationOnce(() =>
      Promise.resolve({
        name: 'test.eth',
        match: false,
        resolverAddress: '0xresolver',
        reverseResolverAddress: '0xreverseResolver',
      }),
    )
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: false }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toBeNull()
  })
  it('should return name when name does not match but allowMismatch is true', async () => {
    mockGetName.mockImplementationOnce(() =>
      Promise.resolve({
        name: 'test.eth',
        match: false,
        resolverAddress: '0xresolver',
        reverseResolverAddress: '0xreverseResolver',
      }),
    )
    // Mock getAddressRecord to return the same address so the check passes
    mockGetAddressRecord.mockImplementationOnce(() =>
      Promise.resolve({
        id: 60,
        name: 'eth',
        value: address,
      }),
    )
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: true }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "beautifiedName": "test.eth",
        "match": false,
        "name": "test.eth",
        "originalName": "test.eth",
        "resolverAddress": "0xresolver",
        "reverseResolverAddress": "0xreverseResolver",
      }
    `)
  })
  
  it('should preserve original name and not beautify when match is false', async () => {
    mockGetName.mockImplementationOnce(() =>
      Promise.resolve({
        name: 'MetaMask.eth',
        match: false,
        resolverAddress: '0xresolver',
        reverseResolverAddress: '0xreverseResolver',
      }),
    )
    // Mock getAddressRecord to return the same address so the check passes
    mockGetAddressRecord.mockImplementationOnce(() =>
      Promise.resolve({
        id: 60,
        name: 'eth',
        value: address,
      }),
    )
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: true }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "beautifiedName": "MetaMask.eth",
        "match": false,
        "name": "MetaMask.eth",
        "originalName": "MetaMask.eth",
        "resolverAddress": "0xresolver",
        "reverseResolverAddress": "0xreverseResolver",
      }
    `)
  })
  
  it('should beautify name when match is true', async () => {
    mockGetName.mockImplementationOnce(() =>
      Promise.resolve({
        name: 'test.eth',
        match: true,
        resolverAddress: '0xresolver',
        reverseResolverAddress: '0xreverseResolver',
      }),
    )
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: false }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toMatchInlineSnapshot(`
      {
        "beautifiedName": "test.eth",
        "match": true,
        "name": "test.eth",
        "originalName": "test.eth",
        "resolverAddress": "0xresolver",
        "reverseResolverAddress": "0xreverseResolver",
      }
    `)
  })

  it('should return null when allowMismatch is true but ETH address record points to different address', async () => {
    const differentAddress = '0x1234567890123456789012345678901234567890'

    mockGetName.mockImplementationOnce(() =>
      Promise.resolve({
        name: 'test.eth',
        match: false,
        resolverAddress: '0xresolver',
        reverseResolverAddress: '0xreverseResolver',
      }),
    )
    // Mock getAddressRecord to return a DIFFERENT address
    mockGetAddressRecord.mockImplementationOnce(() =>
      Promise.resolve({
        id: 60,
        name: 'eth',
        value: differentAddress, // ← Points to different address!
      }),
    )
    const result = await getPrimaryNameQueryFn(mockConfig)({
      queryKey: [{ address, allowMismatch: true }, chainId, address, undefined, 'getName'],
      meta: {} as any,
      signal: undefined as any,
    })
    expect(result).toBeNull() // Should return null because address doesn't match
  })
})
