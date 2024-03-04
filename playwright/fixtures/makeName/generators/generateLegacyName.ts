/**
 * NOTE: This generator uses register/commit methods to generate names. It is not used in a test yet so it might
 * have some bugs.
 */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import { Contracts } from '../../contracts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { Provider } from '../../provider'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname'

const DEFAULT_DURATION = 31536000

export type Name = {
  label: string
  owner?: User
  manager?: User
  duration?: number
  secret?: string
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
  contracts: Contracts
}

export const generateLegacyName =
  ({ provider, accounts, contracts }: Dependencies) =>
  async ({
    label,
    owner = 'user',
    manager,
    duration = DEFAULT_DURATION,
    // eslint-disable-next-line no-restricted-syntax
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    subnames,
  }: Name) => {
    const name = `${label}.eth`
    console.log('generating legacy name:', name)
    const _owner = accounts.getAddress(owner)

    console.log('make commit:', name)
    const controller = contracts.get('LegacyETHRegistrarController', { signer: owner })
    const commitment = await controller.makeCommitment(label, _owner, secret)
    const commitTx = await controller.commit(commitment)
    await commitTx.wait()

    await provider.increaseTime(60)
    await walletClient.mine({ account: accounts.getAccount(owner) })

    console.log('register name:', name)
    const price = await controller.rentPrice(label, duration)
    const registrationTx = await controller.register(label, _owner, duration, secret, {
      value: price,
    })
    await registrationTx.wait()

    // Create subnames
    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
    }))
    for (const subname of _subnames) {
      await generateLegacySubname({ accounts, contracts })(subname)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const tx = await transferName(walletClient, {
        name,
        newOwnerAddress: accounts.getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: accounts.getAccount(owner),
      })
      await waitForTransaction(tx)
    }

    await testClient.increaseTime({ seconds: 61 })
    await walletClient.mine({ account: accounts.getAccount(owner) })
  }
