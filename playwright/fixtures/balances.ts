/* eslint-disable import/no-extraneous-dependencies */
import {
  createPublicClient,
  createTestClient,
  http,
  parseEther,
  type Address,
  type Chain,
  type PublicClient,
  type TestClient
} from 'viem'
import { anvil, mainnet, sepolia } from 'viem/chains'
import { Accounts } from './accounts'

export type BalanceManager = ReturnType<typeof createBalanceManager>

const getChain = (chainName?: string): Chain => {
  if (chainName === 'mainnet') return mainnet
  if (chainName === 'sepolia') return sepolia
  return { ...anvil, id: 1337 }
}

// Store snapshots for test isolation
const snapshots = new Map<string, string>()

// Cache public clients by chain ID to avoid recreation
const clientCache = new Map<number, PublicClient>()
const testClientCache = new Map<number, TestClient>()

const getOrCreatePublicClient = (chain: Chain): PublicClient => {
  const cached = clientCache.get(chain.id)
  if (cached) return cached

  const rpcUrl = chain.id === 1337 ? 'http://localhost:8545' : chain.rpcUrls.default.http[0]
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl),
  })

  clientCache.set(chain.id, client)
  return client
}

const getOrCreateTestClient = (chain: Chain): TestClient => {
  const cached = testClientCache.get(chain.id)
  if (cached) return cached

  const rpcUrl = chain.id === 1337 ? 'http://localhost:8545' : chain.rpcUrls.default.http[0]
  const client = createTestClient({
    chain,
    mode: 'anvil',
    transport: http(rpcUrl),
  })

  testClientCache.set(chain.id, client)
  return client
}

export const createBalanceManager = ({
  accounts,
  chainName
}: {
  accounts: Accounts
  chainName?: string
}) => {
  const chain = getChain(chainName)
  const publicClient = getOrCreatePublicClient(chain)
  const testClient = getOrCreateTestClient(chain)

  const balanceManager = {
    getBalance: async (address: Address) => {
      return await publicClient.getBalance({ address })
    },

    // EVM snapshot management for test isolation
    createSnapshot: async (name: string = 'default'): Promise<string> => {
      // Only works with local anvil/hardhat networks
      if (chain.id !== 1337) {
        console.log('Snapshot only supported on local test network')
        return ''
      }

      try {
        const snapshotId = await testClient.snapshot()
        snapshots.set(name, snapshotId)
        console.log(`Created snapshot ${name}: ${snapshotId}`)
        return snapshotId
      } catch (error) {
        console.error('Failed to create snapshot:', error)
        return ''
      }
    },

    revertSnapshot: async (nameOrId: string = 'default'): Promise<boolean> => {
      // Only works with local anvil/hardhat networks
      if (chain.id !== 1337) {
        console.log('Snapshot only supported on local test network')
        return false
      }

      const snapshotId = snapshots.get(nameOrId) || nameOrId

      try {
        await testClient.revert({ id: snapshotId as `0x${string}` })
        console.log(`Reverted to snapshot ${nameOrId}`)

        // After reverting, we need to create a new snapshot immediately
        // because evm_revert consumes the snapshot
        const newSnapshotId = await testClient.snapshot()
        snapshots.set(nameOrId, newSnapshotId)

        return true
      } catch (error) {
        console.error('Failed to revert snapshot:', error)
        return false
      }
    },

    // Set balance to any amount - use this for all balance manipulation needs:
    // - Replenish: setBalance('user', parseEther('10'))
    // - Drain: setBalance('user', parseEther('0.0001'))
    // - Exact amount: setBalance('user', parseEther('1.5'))
    setBalance: async (user: string, amount: bigint): Promise<bigint> => {
      // Only works with local anvil networks
      if (chain.id !== 1337) {
        console.log('Balance manipulation only supported on local test network')
        const address = accounts.getAddress(user as any) as Address
        return await publicClient.getBalance({ address })
      }

      const address = accounts.getAddress(user as any) as Address

      await testClient.setBalance({
        address,
        value: amount,
      })

      const newBalance = await publicClient.getBalance({ address })
      console.log(`Set balance for ${user} to ${newBalance}`)
      return newBalance
    }
  }

  return balanceManager
}