// @vitest-environment jsdom
import type { Address } from 'viem'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import type { ClientWithEns, ConnectorClientWithEns } from '@app/types'

import migrateProfile from './migrateProfile'

vi.mock('@ensdomains/ensjs/contracts', () => ({ getChainContractAddress: vi.fn() }))
vi.mock('@ensdomains/ensjs/public', () => ({ getRecords: vi.fn() }))
vi.mock('@ensdomains/ensjs/subgraph', () => ({ getSubgraphRecords: vi.fn() }))
vi.mock('@ensdomains/ensjs/wallet', () => ({ setRecords: { makeFunctionData: vi.fn() } }))
vi.mock('@app/utils/records', () => ({
  profileRecordsToKeyValue: vi.fn(async (profile) => ({
    texts: profile.texts,
    coins: profile.coins,
    ...(profile.contentHash ? { contentHash: profile.contentHash } : {}),
    ...(profile.abi ? { abi: profile.abi } : {}),
  })),
  recordsWithCointypeCoins: vi.fn((records) => records),
}))

const sourceResolver = '0x2000000000000000000000000000000000000002' as Address
const latestResolver = '0x3000000000000000000000000000000000000003' as Address

const mockGetSubgraphRecords = getSubgraphRecords as unknown as Mock
const mockGetRecords = getRecords as unknown as Mock
const mockGetChainContractAddress = getChainContractAddress as unknown as Mock
const mockSetRecords = setRecords.makeFunctionData as unknown as Mock

const client = {} as ClientWithEns
const connectorClient = {} as ConnectorClientWithEns
const data = { name: 'test.eth', resolverAddress: sourceResolver }

describe('migrateProfile transaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetChainContractAddress.mockReturnValue(latestResolver)
    mockSetRecords.mockReturnValue({ to: latestResolver, data: '0x' })
  })

  it('throws when the subgraph query itself returns nothing', async () => {
    mockGetSubgraphRecords.mockResolvedValue(null)

    await expect(migrateProfile.transaction({ client, connectorClient, data })).rejects.toThrow(
      'No subgraph records found',
    )
    expect(mockSetRecords).not.toHaveBeenCalled()
  })

  it('refuses to migrate when the source profile comes back empty', async () => {
    mockGetSubgraphRecords.mockResolvedValue({ texts: [], coins: [] })
    mockGetRecords.mockResolvedValue({ texts: [], coins: [], contentHash: null, abi: null })

    await expect(migrateProfile.transaction({ client, connectorClient, data })).rejects.toThrow(
      'No records found to migrate',
    )
    expect(mockSetRecords).not.toHaveBeenCalled()
  })

  it('reads the source records from the supplied resolver and copies them to the latest', async () => {
    mockGetSubgraphRecords.mockResolvedValue({ texts: ['com.twitter'], coins: [] })
    mockGetRecords.mockResolvedValue({
      texts: [{ key: 'com.twitter', value: 'ens' }],
      coins: [],
      contentHash: null,
      abi: null,
    })

    await migrateProfile.transaction({ client, connectorClient, data })

    expect(mockGetSubgraphRecords).toHaveBeenCalledWith(
      client,
      expect.objectContaining({ resolverAddress: sourceResolver }),
    )
    expect(mockGetRecords).toHaveBeenCalledWith(
      connectorClient,
      expect.objectContaining({
        resolver: { address: sourceResolver, fallbackOnly: false },
      }),
    )
    const payload = mockSetRecords.mock.calls[0][1]
    expect(payload.resolverAddress).toEqual(latestResolver)
    // migrateProfile copies without clearing; only the WithReset variant clears
    expect(payload.clearRecords).toBeUndefined()
  })
})
