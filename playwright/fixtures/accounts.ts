/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'
import { Address, Hash } from 'viem'

import { Provider } from './provider.js'
import dotenv from 'dotenv'
import { privateKeyToAccount, nonceManager } from 'viem/accounts'
import { publicClient } from './contracts/utils/addTestContracts';

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

  const usersMap = {
    user: 0,
    user2: 1,
    user3: 2,
  }

  const privateKeys = Object.values(usersMap).map((index: number) => hdNode.derivePath(`m/44'/60'/0'/0/${index}`).privateKey)

  const accounts = Object.values(usersMap).map((index: number) => {
    return privateKeyToAccount(privateKeys[index] as Hash, { 
      nonceManager
    })
  })

  return {
    getAccountForUser: (user: User) => {
      const index = usersMap[user]
      if (typeof index === 'undefined') throw new Error(`User not found: ${user}`)
      return accounts[index]
    },
    getAllPrivateKeys: () => privateKeys,
    getAddress: (user: User, length?: number): Address | string => {
      const index = usersMap[user]
      if (typeof index === 'undefined') throw new Error(`User not found: ${user}`)
      const address = accounts[index].address
      if (!address) throw new Error(`Address not found: ${user}`)
      if (length) return shortenAddress(address, length) as string
      return address as Address
    },
    getPrivateKey: (user: User) => {
      const index = usersMap[user]
      if (typeof index === 'undefined') throw new Error(`User not found: ${user}`)
      return privateKeys[index]
    }
  }
}
