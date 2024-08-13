import { mnemonicToAccount } from 'viem/accounts'
import { Address ,TestClient,bytesToHex} from 'viem'

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
  provider: TestClient<'anvil'>
}

export type Accounts = ReturnType<typeof createAccounts>

export type User = 'user' | 'user2' | 'user3'

export const createAccounts = (stateful = false) => {
  const mnemonic = stateful ? process.env.SECRET_WORDS || DEFAULT_MNEMONIC : DEFAULT_MNEMONIC
  
  const accounts = [0, 1, 2].map((index: number) => {
    const { address, getHdKey } = mnemonicToAccount(mnemonic,{ addressIndex: index })

    const privateKey = getHdKey().privateKey!

    return {
      user: `user${index ? index + 1 : ''}` as User,
      address: address as `0x${string}`,
      privateKey: bytesToHex(privateKey) as `0x${string}`,
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
