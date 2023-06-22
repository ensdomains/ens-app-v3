/* eslint-disable import/no-extraneous-dependencies */

const ACCOUNTS: {
  user: User
  address: `0x${string}`
  privateKey: `0x${string}`
}[] = [
  {
    user: 'user',
    address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  },
  {
    user: 'user2',
    address: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
  },
  {
    user: 'user3',
    address: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
  },
]

export type Accounts = ReturnType<typeof createAccounts>

export type User = 'user' | 'user2' | 'user3'

export const createAccounts = () => ({
  getAllPrivateKeys: () => ACCOUNTS.map(({ privateKey }) => privateKey),
  getAddress: (user: User) => {
    const address = ACCOUNTS.find(({ user: _user }) => _user === user)?.address
    if (!address) throw new Error(`Address not found: ${user}`)
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
