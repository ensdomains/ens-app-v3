import { HardhatRuntimeEnvironment } from 'hardhat/types'

import 'hardhat-deploy'

import {
  Account,
  Address,
  getAddress,
  GetContractReturnType,
  getContract as getViemContract,
  PublicClient,
  WalletClient,
} from 'viem'

import '@nomicfoundation/hardhat-viem'

import type { KeyedClient } from '@nomicfoundation/hardhat-viem/types.js'

import '@nomicfoundation/hardhat-toolbox-viem'

export const getContract =
  (hre: HardhatRuntimeEnvironment) =>
  async <ContractName extends string>(
    contractName: ContractName,
    client_?: {
      public: PublicClient
      wallet: WalletClient
    },
  ) => {
    const deployment = await hre.deployments.getOrNull(contractName)
    if (!deployment) return null

    const client =
      client_ ??
      ({
        public: await hre.viem.getPublicClient(),
        wallet: await hre.viem.getWalletClients().then(([c]) => c),
      } as {
        public: PublicClient
        wallet: WalletClient
      })

    const contract = getViemContract({
      abi: deployment.abi,
      address: deployment.address as Address,
      client,
    })

    if (!contract) throw new Error(`Could not find contract ${contractName}`)

    return contract
  }

type Client = Required<KeyedClient> & { address: Address; account: Account }

export const getNamedClients = (hre: HardhatRuntimeEnvironment) => async () => {
  const publicClient = await hre.viem.getPublicClient()
  const namedAccounts = await hre.getNamedAccounts()
  const clients: Record<string, Client> = {}

  for (const [name, address] of Object.entries(namedAccounts)) {
    // eslint-disable-next-line no-await-in-loop
    const namedClient = await hre.viem.getWalletClient(address as Address)
    clients[name] = {
      public: publicClient,
      wallet: namedClient,
      address: getAddress(address),
      account: namedClient.account,
    }
  }

  return clients
}
