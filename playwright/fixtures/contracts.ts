/* eslint-disable import/no-extraneous-dependencies */
import { Accounts, User } from './accounts'
import { getContract } from './makeName/utils/getContract'
import { Provider } from './provider'

type Dependencies = {
  provider: Provider
  accounts: Accounts
}

type Contract = Parameters<typeof getContract>[0]

export const createContracts = ({ accounts, provider }: Dependencies) => ({
  get: async (
    contract: Contract,
    { signer, address }: { signer?: User; address?: `0x${string}` } = {},
  ) => {
    const options = {
      signer: signer ? provider.getSigner(accounts.getAddress(signer)) : undefined,
      address,
    }
    return getContract(contract, options)
  },
})
