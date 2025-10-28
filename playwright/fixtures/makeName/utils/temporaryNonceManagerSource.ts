import type { Address, NonceManagerSource } from 'viem'
import { getTransactionCount } from 'viem/actions'

export const temporaryNonceManagerSource = () => {
  const current: {
    [key: Address]: number | undefined
  } = {}
  return {
    get: async (parameters) => {
      const { address, client } = parameters
      const remoteNonce = await getTransactionCount(client, { address, blockTag: 'pending' })
      const newNonce = Math.max(remoteNonce, current[address] ?? 0)
      console.log(
        'nonce for:',
        address,
        'remote:',
        remoteNonce,
        'current:',
        current[address],
        'new:',
        newNonce,
      )
      return newNonce
    },
    set: (parameters, nonce) => {
      const { address } = parameters
      console.log('setting nonce for:', address, nonce)
      current[address] = nonce
    },
  } satisfies NonceManagerSource
}
