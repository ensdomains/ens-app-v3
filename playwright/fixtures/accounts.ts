/* eslint-disable import/no-extraneous-dependencies */
import { shortenAddress } from '@app/utils/utils'

const ACCOUNTS: {
  user: User
  address: `0x${string}`
  privateKey: `0x${string}`
}[] = [
  {
    user: 'user',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  {
    user: 'user2',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  },
  {
    user: 'user3',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  },
]

export type Accounts = ReturnType<typeof createAccounts>

export type User = 'user' | 'user2' | 'user3'

export const createAccounts = () => ({
  getAllPrivateKeys: () => ACCOUNTS.map(({ privateKey }) => privateKey),
  getAddress: (user: User, length?: number) => {
    const address = ACCOUNTS.find(({ user: _user }) => _user === user)?.address
    if (!address) throw new Error(`Address not found: ${user}`)
    if (length) return shortenAddress(address, length)
    return address
  },
  getPrivateKey: (user: User) => ACCOUNTS.find(({ user: _user }) => _user === user)?.privateKey,
  getIndex: (addressOrUser: string) => {
    const index = ACCOUNTS.findIndex(
      ({ address, user }) => address === addressOrUser || user === addressOrUser,
    )
    if (index === -1) throw new Error(`Account not found: ${addressOrUser}`)
    return index
  },
})
