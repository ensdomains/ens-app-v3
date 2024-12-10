import { describe, expect, it } from 'vitest'

import { supportedAddresses } from '@app/constants/supportedAddresses'

import { getCoinChainQueryFn } from './useCoinChain'

describe('getCoinChainQueryFn', () => {
  it.each(supportedAddresses)(
    'should return data for supported coin: %s',
    async (coinName: any) => {
      const result = await getCoinChainQueryFn({ queryKey: [{ coinName }] } as any)
      expect(result).not.toBeNull()
    },
  )

  it.each(['bsc'])('should return data for evm coin: %s', async (coinName: any) => {
    const result = await getCoinChainQueryFn({ queryKey: [{ coinName }] } as any)
    expect(result).not.toBeNull()
  })

  it('should return null for unsupported coin', async () => {
    const result = await getCoinChainQueryFn({ queryKey: [{ coinName: 'unsupported' }] } as any)
    expect(result).toBeNull()
  })
})
