/* eslint-disable import/no-extraneous-dependencies */
import { Contract as ContractClass } from '@ethersproject/contracts'
import { match } from 'ts-pattern'

import LegacyETHRegistrarControllerJSON from '@ensdomains/ens-contracts/deployments/archive/ETHRegistrarController_mainnet_9380471.sol/ETHRegistrarController_mainnet_9380471.json'
import { ENSRegistry__factory } from '@ensdomains/ensjs/generated/factories/ENSRegistry__factory'
import { ETHRegistrarController__factory } from '@ensdomains/ensjs/generated/factories/ETHRegistrarController__factory'
import { NameWrapper__factory } from '@ensdomains/ensjs/generated/factories/NameWrapper__factory'
import { PublicResolver__factory } from '@ensdomains/ensjs/generated/factories/PublicResolver__factory'
import { ReverseRegistrar__factory } from '@ensdomains/ensjs/generated/factories/ReverseRegistrar__factory'

require('dotenv').config({ path: '.env.local' })

type Contract =
  | 'ENSRegistry'
  | 'ETHRegistrarController'
  | 'NameWrapper'
  | 'PublicResolver'
  | 'LegacyETHRegistrarController'
  | 'ReverseRegistrar'

type Options = {
  signer?: any
  address?: string
}

export const getContract = (contract: Contract, { signer, address }: Options = {}) => {
  const json = process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES
  if (!json) throw new Error('No deployment addresses found')
  const addresses = JSON.parse(json)

  return match(contract)
    .with('ENSRegistry', () => ENSRegistry__factory.connect(addresses.ENSRegistry, signer))
    .with('ETHRegistrarController', () =>
      ETHRegistrarController__factory.connect(addresses.ETHRegistrarController, signer),
    )
    .with('NameWrapper', () => NameWrapper__factory.connect(addresses.NameWrapper, signer))
    .with('PublicResolver', () =>
      PublicResolver__factory.connect(address || addresses.PublicResolver, signer),
    )
    .with('ReverseRegistrar', () =>
      ReverseRegistrar__factory.connect(addresses.ReverseRegistrar, signer),
    )
    .with(
      'LegacyETHRegistrarController',
      () =>
        new ContractClass(
          addresses.LegacyETHRegistrarController,
          LegacyETHRegistrarControllerJSON.abi,
          signer,
        ),
    )
    .exhaustive()
}
