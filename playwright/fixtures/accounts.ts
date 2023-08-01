/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers'

import { shortenAddress } from '@app/utils/utils'

import { Provider } from './provider'

export type Dependencies = {
  provider: Provider
}

export type Accounts = ReturnType<typeof createAccounts>

export type User = 'user' | 'user2' | 'user3'

export const createAccounts = () => {
  const mnemonic =
    process.env.SECRET_WORDS || 'test test test test test test test test test test test junk'
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic)
  const _accounts = [0, 1, 2].map((index: number) => {
    const { address, privateKey } = hdNode.derivePath(`m/44'/60'/0'/0/${index}`)
    return {
      user: `user${index ? index + 1 : ''}` as User,
      address: address as `0x${string}`,
      privateKey: privateKey as `0x${string}`,
    }
  })

  const accounts = [
    {
      user: 'user',
      address: '0x32518828A071a0e6E549F989D4aaB4Cd7401be8f',
      privateKey: '0xf0b15dbc015868b1d8e3f2625a08deee2e7729aecf0d7699ca1220bb386478e9',
    },
  ]

  return {
    getAllPrivateKeys: () => accounts.map(({ privateKey }) => privateKey),
    getAddress: (user: User, length?: number) => {
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
