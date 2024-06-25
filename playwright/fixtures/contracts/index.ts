/* eslint-disable import/no-extraneous-dependencies */
import { Wallet } from 'ethers'

import { Accounts, User } from '../accounts'
import { Provider } from '../provider'
import { getContract } from './utils/getContract'

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

export type Contracts = ReturnType<typeof createContracts>

type ContractName = Parameters<typeof getContract>[0]

export const createContracts = ({ accounts, provider }: Dependencies) => ({
  get: (
    contract: ContractName,
    { signer, address }: { signer?: User; address?: `0x${string}` } = {},
  ) => {
    const options = {
      signer: signer ? new Wallet(accounts.getPrivateKey(signer)!, provider) : undefined,
      address,
    }
    return getContract(contract, options)
  },
})
