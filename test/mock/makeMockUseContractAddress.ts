import dotenv from 'dotenv'
import { Address, ChainContract } from 'viem'
import { localhost } from 'viem/chains'

import { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

dotenv.config({ path: '.env.local' })

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns<typeof localhost>(
  localhost,
  deploymentAddresses,
)

type ContractName = keyof typeof localhostWithEns.contracts

// Deterministic stub addresses used when `.env.local` (or
// NEXT_PUBLIC_DEPLOYMENT_ADDRESSES) isn't set — keeps useContractAddress
// truthy across the test suite so hooks that branch on contract presence
// (e.g. useBasicName's `canBeWrapped`) behave as the fixtures expect.
// Real values are still picked up first when the env var is provided.
const STUB_ADDRESSES: Record<string, Address> = {
  ensRegistry: '0x0000000000000000000000000000000000000001',
  ensUniversalResolver: '0x0000000000000000000000000000000000000002',
  multicall3: '0xcA11bde05977b3631167028862bE2a173976CA11',
  ensBaseRegistrarImplementation: '0x0000000000000000000000000000000000000003',
  ensDnsRegistrar: '0x0000000000000000000000000000000000000004',
  ensEthRegistrarController: '0x0000000000000000000000000000000000000005',
  ensNameWrapper: '0x0000000000000000000000000000000000000006',
  ensPublicResolver: '0x0000000000000000000000000000000000000007',
  ensReverseRegistrar: '0x0000000000000000000000000000000000000008',
  ensBulkRenewal: '0x0000000000000000000000000000000000000009',
}

export const makeMockUseContractAddress = ({ contract }: { contract: ContractName }) => {
  const chainContract = localhostWithEns.contracts[contract] as ChainContract
  return (chainContract?.address as Address | undefined) ?? STUB_ADDRESSES[contract as string]
}
