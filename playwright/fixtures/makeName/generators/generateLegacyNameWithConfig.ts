/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setResolver, transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import { Contracts } from '../../contracts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { Provider } from '../../provider'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname'
import { generateRecords } from './generateRecords'

const LEGACY_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address
const PUBLIC_RESOLVER = testClient.chain.contracts.publicResolver.address
const DEFAULT_DURATION = 31536000
const DEFAULT_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address

export type Name = {
  label: string
  owner?: User
  manager?: User
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  addr?: User
  records?: RecordOptions
  subnames?: Omit<LegacySubname, 'name'>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
  contracts: Contracts
}

export const generateLegacyNameWithConfig =
  ({ provider, accounts, contracts }: Dependencies) =>
  async ({
    label,
    owner = 'user',
    manager,
    duration = DEFAULT_DURATION,
    // eslint-disable-next-line no-restricted-syntax
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver = DEFAULT_RESOLVER,
    addr = owner,
    records,
    subnames,
  }: Name) => {
    const name = `${label}.eth`
    console.log('generating legacy name:', name)

    const _owner = accounts.getAddress(owner)
    const _addr = accounts.getAddress(addr)

    const ownerAccount = accounts.getAccount(owner)

    // Registration will fail if resolver is not valid. If an invalid resolver is entered
    // we will set the resolver after the name has been registered.
    const hasValidResolver = [LEGACY_RESOLVER, PUBLIC_RESOLVER].includes(resolver)
    // && VALID_RESOLVERS.includes(resolver)
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    console.log('making commitment:', name)
    const controller = contracts.get('LegacyETHRegistrarController', { signer: owner })
    console.log({
      label,
      _owner,
      secret,
      _resolver,
      _addr,
    })
    const commitment = await controller.makeCommitmentWithConfig(
      label,
      _owner,
      secret,
      _resolver,
      _addr,
    )
    const commitTx = await controller.commit(commitment)
    await commitTx.wait()

    await provider.increaseTime(120)
    await walletClient.mine({ account: ownerAccount })

    console.log('registering name:', name)
    const price = await controller.rentPrice(label, duration)
    const registrationTx = await controller.registerWithConfig(
      label,
      _owner,
      duration,
      secret,
      _resolver,
      _addr,
      {
        value: price,
        gasLimit: 1000000,
      },
    )
    await registrationTx.wait()

    // Create records
    await generateRecords({ accounts })({ name: `${label}.eth`, owner, resolver, records })

    // Create subnames
    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
      resolver: subname.resolver ?? _resolver,
    }))
    for (const subname of _subnames) {
      await generateLegacySubname({ accounts, contracts })(subname)
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver:', name, resolver)
      const tx = await setResolver(walletClient, {
        name,
        contract: 'registry',
        resolverAddress: resolver,
        account: ownerAccount,
      })
      await waitForTransaction(tx)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const tx = await transferName(walletClient, {
        name,
        newOwnerAddress: accounts.getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: ownerAccount,
      })
      await waitForTransaction(tx)
    }

    await walletClient.mine({ account: ownerAccount })
  }
