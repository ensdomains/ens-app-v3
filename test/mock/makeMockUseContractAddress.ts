import dotenv from 'dotenv'
import { Address } from 'viem'

dotenv.config({ path: '.env.local' })

const deploymentsString = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}'
const deploymentAddresses = JSON.parse(deploymentsString)
const contracts = {
  ensRegistry: {
    address: deploymentAddresses.ENSRegistry,
  },
  ensUniversalResolver: {
    address: deploymentAddresses.UniversalResolver,
  },
  multicall3: {
    address: deploymentAddresses.Multicall,
  },
  ensBaseRegistrarImplementation: {
    address: deploymentAddresses.BaseRegistrarImplementation,
  },
  ensDnsRegistrar: {
    address: deploymentAddresses.LegacyDNSRegistrar,
  },
  ensEthRegistrarController: {
    address: deploymentAddresses.ETHRegistrarController,
  },
  ensLegacyEthRegistrarController: {
    address: deploymentAddresses.LegacyETHRegistrarController,
  },
  ensNameWrapper: {
    address: deploymentAddresses.NameWrapper,
  },
  ensPublicResolver: {
    address: deploymentAddresses.PublicResolver,
  },
  ensReverseRegistrar: {
    address: deploymentAddresses.ReverseRegistrar,
  },
  ensBulkRenewal: {
    address: deploymentAddresses.StaticBulkRenewal,
  },
  ensDnssecImpl: {
    address: deploymentAddresses.LegacyDNSSECImpl,
  },
  legacyPublicResolver: {
    address: deploymentAddresses.LegacyPublicResolver,
  },
  publicResolver: {
    address: deploymentAddresses.PublicResolver,
  },
} as const

type ContractName = keyof typeof contracts

export const makeMockUseContractAddress = ({ contract }: { contract: ContractName }) => {
  return contracts[contract]?.address as Address
}
