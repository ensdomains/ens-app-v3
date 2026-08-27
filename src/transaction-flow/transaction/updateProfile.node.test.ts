// @vitest-environment jsdom
import type { Address, Hex } from 'viem'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'

import { setRecords } from '@ensdomains/ensjs/wallet'

import type { ClientWithEns, ConnectorClientWithEns } from '@app/types'
import { getUnderlyingResolver } from '@app/utils/resolver/getUnderlyingResolver'

import updateProfile from './updateProfile'

vi.mock('@ensdomains/ensjs/wallet', () => ({
  setRecords: { makeFunctionData: vi.fn() },
}))
vi.mock('@app/utils/resolver/getUnderlyingResolver', () => ({
  getUnderlyingResolver: vi.fn(),
}))

const abstractionResolver = '0x1000000000000000000000000000000000000001' as Address
const underlyingResolver = '0x2000000000000000000000000000000000000002' as Address
const mockGetUnderlyingResolver = getUnderlyingResolver as unknown as Mock
const mockSetRecords = setRecords.makeFunctionData as unknown as Mock

const client = {} as ClientWithEns
const connectorClient = {} as ConnectorClientWithEns
const data = {
  name: 'test.eth',
  resolverAddress: abstractionResolver,
  records: { texts: [{ key: 'description', value: 'hello' }] },
}

describe('updateProfile transaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSetRecords.mockReturnValue({ to: underlyingResolver, data: '0x1234' as Hex })
  })

  it('writes profile records to the underlying resolver for an abstracted name', async () => {
    mockGetUnderlyingResolver.mockResolvedValue(underlyingResolver)

    await updateProfile.transaction({ client, connectorClient, data })

    expect(mockGetUnderlyingResolver).toHaveBeenCalledWith(client, {
      name: 'test.eth',
      resolverAddress: abstractionResolver,
    })
    expect(mockSetRecords).toHaveBeenCalledWith(
      connectorClient,
      expect.objectContaining({ resolverAddress: underlyingResolver }),
    )
  })

  it('keeps writing to the supplied resolver when the name is not abstracted', async () => {
    mockGetUnderlyingResolver.mockResolvedValue(null)

    await updateProfile.transaction({ client, connectorClient, data })

    expect(mockSetRecords).toHaveBeenCalledWith(
      connectorClient,
      expect.objectContaining({ resolverAddress: abstractionResolver }),
    )
  })

  it('fails closed instead of building calldata when the probe fails unexpectedly', async () => {
    const transportError = new Error('network unavailable')
    mockGetUnderlyingResolver.mockRejectedValue(transportError)

    await expect(updateProfile.transaction({ client, connectorClient, data })).rejects.toBe(
      transportError,
    )
    expect(mockSetRecords).not.toHaveBeenCalled()
  })
})
