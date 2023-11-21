/* eslint-disable import/no-extraneous-dependencies */
import { Contract as ContractClass } from '@ethersproject/contracts'
import { match } from 'ts-pattern'

import LegacyETHRegistrarControllerJSON from '@ensdomains/ens-contracts/deployments/archive/ETHRegistrarController_mainnet_9380471.sol/ETHRegistrarController_mainnet_9380471.json'

require('dotenv').config({ path: '.env.local' })

type Contract =
  | 'LegacyETHRegistrarController'

type Options = {
  signer?: any
  address?: string
}

export const getContract = (contract: Contract, { signer, address }: Options = {}) => {
  const json = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES
  if (!json) throw new Error('No deployment addresses found')
  const addresses = JSON.parse(json)

  return match(contract)
    .with(
      'LegacyETHRegistrarController',
      () =>
        new ContractClass(
          addresses.LegacyETHRegistrarController,
          LegacyETHRegistrarControllerJSON.abi,
          signer,
        ),
    ).exhaustive()
}
