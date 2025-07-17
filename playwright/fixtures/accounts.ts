/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv'
import { Account, Address, bytesToHex, Hash } from 'viem'
import { mnemonicToAccount, nonceManager, privateKeyToAccount } from 'viem/accounts'

dotenv.config()

const DEFAULT_MNEMONIC = 'test test test test test test test test test test test junk'

const shortenAddress = (address = '', maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`
}

export type Accounts = ReturnType<typeof createAccounts>

const users = ['user', 'user2', 'user3', 'user4'] as const
export type User = (typeof users)[number]

export const createAccounts = (stateful = false) => {
  const mnemonic = stateful ? process.env.SECRET_WORDS || DEFAULT_MNEMONIC : DEFAULT_MNEMONIC

  const { accounts, privateKeys } = users.reduce<{ accounts: Account[]; privateKeys: Hash[] }>(
    (acc, _, index) => {
      const { getHdKey } = mnemonicToAccount(mnemonic, { addressIndex: index })
      const privateKey = bytesToHex(getHdKey().privateKey!)
      const account = privateKeyToAccount(privateKey, { nonceManager })
      return {
        accounts: [...acc.accounts, account],
        privateKeys: [...acc.privateKeys, privateKey],
      }
    },
    { accounts: [], privateKeys: [] },
  )

  return {
    getAccountForUser: (user: User) => {
      const index = users.indexOf(user)
      if (index < 0) throw new Error(`User not found: ${user}`)
      return accounts[index]
    },
    getAllPrivateKeys: () => privateKeys,
    getAddress: (user: User, length?: number): Address | string => {
      const index = users.indexOf(user)
      if (index < 0) throw new Error(`User not found: ${user}`)
      const address = accounts[index].address
      if (!address) throw new Error(`Address not found: ${user}`)
      if (length) return shortenAddress(address, length) as string
      return address as Address
    },
    getPrivateKey: (user: User) => {
      const index = users.indexOf(user)
      if (index < 0) throw new Error(`User not found: ${user}`)
      return privateKeys[index]
    },
  }
}
