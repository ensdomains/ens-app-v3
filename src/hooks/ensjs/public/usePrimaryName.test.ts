import { mockFunction } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { getName } from '@ensdomains/ensjs/public'

import { ClientWithEns, ConfigWithEns } from '@app/types'

import { getPrimaryNameQueryFn } from './usePrimaryName'

vi.mock('@ensdomains/ensjs/public')

const mockGetName = mockFunction(getName)

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
        "resolverAddress": "0xresolver",
        "reverseResolverAddress": "0xreverseResolver",
      }
    `)
  })
})
