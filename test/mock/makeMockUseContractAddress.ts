import dotenv from 'dotenv'
import { Address } from 'viem'

import { makeLocalhostWithEns } from '@app/constants/chains'
import { Register } from '@app/local-contracts'

dotenv.config({ path: '.env.local' })

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhost = makeLocalhostWithEns(deploymentAddresses)

type ContractName = keyof typeof localhost.contracts
export const makeMockUseContractAddress = ({ contract }: { contract: ContractName }) => {
  return localhost.contracts[contract]?.address as Address
}
