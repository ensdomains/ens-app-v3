/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'
import { Address } from 'viem'

import { Provider } from './provider.js'
import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_MNEMONIC = 'test test test test test test test test test test test junk'

const shortenAddress = (address = '', maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`
}

export type Dependencies = {
  provider: Provider
}

export type Accounts = ReturnType<typeof createAccounts>

export type User = 'user' | 'user2' | 'user3'

export const createAccounts = (stateful = false) => {
  const mnemonic = stateful ? process.env.SECRET_WORDS || DEFAULT_MNEMONIC : DEFAULT_MNEMONIC
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic)
  const accounts = [0, 1, 2].map((index: number) => {
    const { address, privateKey } = hdNode.derivePath(`m/44'/60'/0'/0/${index}`)
    return {
      user: `user${index ? index + 1 : ''}` as User,
      address: address as `0x${string}`,
      privateKey: privateKey as `0x${string}`,
      // privateKey: walletClient.account[index].privateKey,
    }
  })

  return {
    getAllPrivateKeys: () => accounts.map(({ privateKey }) => privateKey),
    getAddress: (user: User, length?: number): Address | string => {
      const address = accounts.find(({ user: _user }) => _user === user)?.address
      if (!address) throw new Error(`Address not found: ${user}`)
      if (length) return shortenAddress(address, length)
      return address
    },
    getPrivateKey: (user: User) => accounts.find(({ user: _user }) => _user === user)?.privateKey,
    getIndex: (addressOrUser: string) => {
      const index = accounts.findIndex(
        ({ address, user }) => address === addressOrUser || user === addressOrUser,
      )
      if (index === -1) throw new Error(`Account not found: ${addressOrUser}`)
      return index
    },
  }
}
