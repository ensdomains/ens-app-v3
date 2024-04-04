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
export const makeMockUseContractAddress = ({ contract }: { contract: ContractName }) => {
  const chainContract = localhostWithEns.contracts[contract] as ChainContract
  return chainContract?.address as Address
}
