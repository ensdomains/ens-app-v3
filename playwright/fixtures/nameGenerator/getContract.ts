/* eslint-disable import/no-extraneous-dependencies */
import { Contract as ContractClass } from '@ethersproject/contracts'

import LegacyETHRegistrarControllerJSON from '@ensdomains/ens-contracts/deployments/archive/ETHRegistrarController_mainnet_9380471.sol/ETHRegistrarController_mainnet_9380471.json'
import ETHRegistrarControllerJSON from '@ensdomains/ens-contracts/deployments/mainnet/ETHRegistrarController.json'
import PublicResolverJSON from '@ensdomains/ens-contracts/deployments/mainnet/PublicResolver.json'

require('dotenv').config({ path: '.env.local' })

const contractAbis = {
  LegacyETHRegistrarController: LegacyETHRegistrarControllerJSON.abi,
  PublicResolver: PublicResolverJSON.abi,
  ETHRegistrarController: ETHRegistrarControllerJSON.abi,
}

type Contract = keyof typeof contractAbis

export const getContract = (contract: Contract, providerOrSigner?: any) => {
  const json = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES
  if (!json) throw new Error('No deployment addresses found')

  const addresses = JSON.parse(json)
  const address = addresses[contract]
  if (!address) throw new Error(`No address found for ${contract}`)

  const abi = contractAbis[contract]
  if (!abi) throw new Error(`No ABI found for ${contract}`)

  return new ContractClass(address, abi, providerOrSigner)
}
