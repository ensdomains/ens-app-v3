import type { Address, NonceManagerSource } from 'viem'
import { getTransactionCount } from 'viem/actions'

export const temporaryNonceManagerSource = () => {
  const current: {
    [key: Address]: number | undefined
  } = {}
  return {
    get: async (parameters) => {
      const { address, client } = parameters
      if (typeof current[address] === 'undefined') {
        console.log('getting nonce for:', address)
        current[address] = await getTransactionCount(client, { address, blockTag: 'pending' })
        console.log('nonce for:', address, current[address])
      } else {
        console.log(
          'nonce for[existing]:',
          address,
          current[address],
          await getTransactionCount(client, { address, blockTag: 'pending' }),
        )
      }
      return current[address]
    },
    set: (parameters, nonce) => {
      const { address } = parameters
      console.log('setting nonce for:', address, nonce)
      current[address] = nonce
    },
  } satisfies NonceManagerSource
}
