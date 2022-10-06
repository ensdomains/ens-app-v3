import type { ethers as EthersT } from 'ethers'

type Ethers = typeof EthersT & {
  provider: EthersT.providers.JsonRpcProvider
}

export const nonceManager =
  <T extends object>(
    ethers: Ethers,
    allNamedAccts: Record<string, string>,
    allNameData: Array<T>,
  ) =>
  async (
    property: keyof T,
    func: (nonce: number) => (data: T, index: number) => Promise<number>,
    filter?: (data: T) => boolean,
    nonceMap?: Record<string, number>,
  ) => {
    const newNonceMap = nonceMap || {}
    for (const account of Object.values(allNamedAccts)) {
      const namesWithAccount = allNameData.filter(
        (data) => data[property] === account && (filter ? filter(data) : true),
      )
      if (!newNonceMap[account]) {
        const nonce = await ethers.provider.getTransactionCount(account)
        newNonceMap[account] = nonce
      }
      let usedNonces = 0

      for (let i = 0; i < namesWithAccount.length; i += 1) {
        const data = namesWithAccount[i]
        usedNonces += await func(newNonceMap[account])(data, i)
      }
      newNonceMap[account] += usedNonces
    }
    return newNonceMap
  }
