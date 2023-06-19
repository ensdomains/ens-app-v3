/* eslint-disable import/no-extraneous-dependencies */
import { Contract as ContractClass } from '@ethersproject/contracts'

import LegacyETHRegistrarControllerJSON from '@ensdomains/ens-contracts/deployments/archive/ETHRegistrarController_mainnet_9380471.sol/ETHRegistrarController_mainnet_9380471.json'
import ENSRegistryJSON from '@ensdomains/ens-contracts/deployments/mainnet/ENSRegistry.json'
import ETHRegistrarControllerJSON from '@ensdomains/ens-contracts/deployments/mainnet/ETHRegistrarController.json'
import PublicResolverJSON from '@ensdomains/ens-contracts/deployments/mainnet/PublicResolver.json'
import { ETHRegistrarController__factory } from '@ensdomains/ensjs/generated/factories/ETHRegistrarController__factory'

require('dotenv').config({ path: '.env.local' })

const contractAbis = {
  LegacyETHRegistrarController: LegacyETHRegistrarControllerJSON.abi,
  PublicResolver: PublicResolverJSON.abi,
  ETHRegistrarController: ETHRegistrarControllerJSON.abi,
  ENSRegistry: ENSRegistryJSON.abi,
}

type Contract = keyof typeof contractAbis

type Options = {
  signer?: any
  address?: string
}

export const getContract = (contract: Contract, { signer, address }: Options = {}) => {
  const json = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES
  if (!json) throw new Error('No deployment addresses found')

  let _address = address
  if (!_address) {
    const addresses = JSON.parse(json)
    _address = addresses[contract]
  }
  if (!_address) throw new Error(`No address found for ${contract}`)

  if (contract === 'ETHRegistrarController')
    return ETHRegistrarController__factory.connect(_address, signer)

  const abi = contractAbis[contract]
  if (!abi) throw new Error(`No ABI found for ${contract}`)

  return new ContractClass(_address, abi, signer)
}
