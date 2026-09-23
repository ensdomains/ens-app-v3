import type { Address } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import updateProfileRecords from './updateProfileRecords'

vi.mock('@ensdomains/ensjs/wallet', () => ({
  setRecords: {
    makeFunctionData: vi.fn((_client, params) => ({
      to: params.resolverAddress,
      data: '0xdeadbeef',
    })),
  },
}))

const mirror = '0xae66c62AcAE72098BdAc57d8E8AED53EF000b2Ba' as Address
const underlying = '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD' as Address

describe('updateProfileRecords', () => {
  // A composite (mirror) resolver holds no records and implements no
  // record-writing interface, so a save aimed at it reverts on chain. The
  // caller pins the resolver behind it; this asserts the builder addresses the
  // transaction to exactly the resolver it was given and never re-derives one.
  it('addresses the write to the pinned resolver', async () => {
    const result = await updateProfileRecords.transaction({
      client: {} as never,
      connectorClient: {} as never,
      data: {
        name: 'test.eth',
        resolverAddress: underlying,
        records: [{ key: 'url', value: 'https://ens.domains', type: 'text', group: 'general' }],
        previousRecords: [],
        clearRecords: false,
      },
    } as never)

    expect(result.to).toEqual(underlying)
    expect(result.to).not.toEqual(mirror)
  })
})
