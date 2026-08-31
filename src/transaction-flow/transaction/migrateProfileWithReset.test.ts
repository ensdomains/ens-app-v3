import type { Address } from 'viem'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { getChainContractAddress } from '@ensdomains/ensjs/contracts'
import { getRecords } from '@ensdomains/ensjs/public'
import { getSubgraphRecords } from '@ensdomains/ensjs/subgraph'
import { setRecords } from '@ensdomains/ensjs/wallet'

import type { ClientWithEns, ConnectorClientWithEns } from '@app/types'

import migrateProfileWithReset from './migrateProfileWithReset'

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

describe('migrateProfileWithReset transaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetChainContractAddress.mockReturnValue(latestResolver)
    mockSetRecords.mockReturnValue({ to: latestResolver, data: '0x' })
  })

  it('refuses to build a clearing write when the source profile comes back empty', async () => {
    mockGetSubgraphRecords.mockResolvedValue(null)
    mockGetRecords.mockResolvedValue({ texts: [], coins: [], contentHash: null, abi: null })

    await expect(
      migrateProfileWithReset.transaction({ client, connectorClient, data }),
    ).rejects.toThrow('No records found to migrate')
    expect(mockSetRecords).not.toHaveBeenCalled()
  })

  it('reads the source records from the supplied resolver and writes them to the latest', async () => {
    mockGetSubgraphRecords.mockResolvedValue({ texts: ['com.twitter'], coins: [] })
    mockGetRecords.mockResolvedValue({
      texts: [{ key: 'com.twitter', value: 'ens' }],
      coins: [],
      contentHash: null,
      abi: null,
    })

    await migrateProfileWithReset.transaction({ client, connectorClient, data })

    expect(mockGetSubgraphRecords).toHaveBeenCalledWith(client, {
      name: 'test.eth',
      resolverAddress: sourceResolver,
    })
    expect(mockGetRecords).toHaveBeenCalledWith(
      client,
      expect.objectContaining({
        resolver: { address: sourceResolver, fallbackOnly: false },
      }),
    )
    expect(mockSetRecords).toHaveBeenCalledWith(
      connectorClient,
      expect.objectContaining({ clearRecords: true, resolverAddress: latestResolver }),
    )
  })

  it('lets a contenthash-only profile through the records floor and keeps the contenthash', async () => {
    mockGetSubgraphRecords.mockResolvedValue(null)
    mockGetRecords.mockResolvedValue({
      texts: [],
      coins: [],
      contentHash: { protocolType: 'ipfs', decoded: 'bafy' },
      abi: null,
    })

    await migrateProfileWithReset.transaction({ client, connectorClient, data })

    expect(mockSetRecords).toHaveBeenCalledWith(
      connectorClient,
      expect.objectContaining({
        contentHash: { protocolType: 'ipfs', decoded: 'bafy' },
      }),
    )
  })
})
