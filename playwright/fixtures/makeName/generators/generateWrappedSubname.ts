/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { getOwner } from '@ensdomains/ensjs/public'
import { EncodeFusesInputObject, RecordOptions } from '@ensdomains/ensjs/utils'
import { createSubname, unwrapName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import { Contracts } from '../../contracts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts'
import { Provider } from '../../provider'
import { generateRecords } from './generateRecords'

// type Fuse = ParentFuses['fuse'] | ChildFuses['fuse']

export type WrappedSubname = {
  name: string
  nameOwner: User
  label: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
  fuses?: EncodeFusesInputObject
  duration?: number
  type?: 'wrapped' | 'legacy'
  subnames?: Omit<WrappedSubname, 'name' | 'nameOwner '>[]
}

type Dependencies = {
  provider: Provider
  accounts: Accounts
  contracts: Contracts
}

const DEFAULT_RESOLVER = testClient.chain.contracts.ensPublicResolver.address

export const generateWrappedSubname =
  ({ provider, accounts, contracts }: Dependencies) =>
  async ({
    name,
    label,
    owner,
    nameOwner,
    resolver = DEFAULT_RESOLVER,
    records,
    fuses,
    duration = 31536000,
    subnames,
    type,
  }: WrappedSubname) => {
    const subname = `${label}.${name}`
    console.log('generating wrapped subname:', subname)

    const nameOwnerAccount = accounts.getAccount(nameOwner)
    const ownerAccount = accounts.getAccount(owner)

    const blockTimestamp = await provider.getBlockTimestamp()
    const expiry = duration + blockTimestamp

    // Make subname with resolver

    console.log({ owner, nameOwner })

    let parentOwner = await getOwner(walletClient, { name, contract: 'nameWrapper' })
    let retryCount = 0

    while (parentOwner?.owner !== nameOwnerAccount.address && retryCount < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      parentOwner = await getOwner(walletClient, { name, contract: 'nameWrapper' })
      retryCount += 1
    }

    if (parentOwner?.owner !== nameOwnerAccount.address) {
      console.log({
        parentOwner: parentOwner?.owner,
        owner: ownerAccount.address,
        nameOwner: nameOwnerAccount.address,
      })
      throw new Error(
        `Parent owner ${parentOwner?.owner} is not the expected owner ${nameOwnerAccount.address}`,
      )
    }

    console.log('OWNER OF PARENT', await getOwner(walletClient, { name, contract: 'nameWrapper' }))

    console.log('making subname', {
      name: `${label}.${name}`,
      contract: 'nameWrapper',
      fuses,
      owner: ownerAccount.address,
      account: nameOwnerAccount,
      resolverAddress: resolver,
      expiry,
    })

    const tx = await createSubname(walletClient, {
      name: `${label}.${name}`,
      contract: 'nameWrapper',
      fuses,
      owner: ownerAccount.address,
      account: nameOwnerAccount,
      resolverAddress: resolver,
      expiry,
    })
    await waitForTransaction(tx)

    // Make records
    if (records) {
      await generateRecords({ accounts })({
        name: `${label}.${name}`,
        owner,
        resolver,
        records,
      })
    }

    if (type === 'legacy') {
      const wrapTx = await unwrapName(walletClient, {
        name: `${label}.${name}`,
        newOwnerAddress: ownerAccount.address,
        account: ownerAccount,
      })
      await waitForTransaction(wrapTx)
    }

    const _subNames = (subnames || []).map((subName) => ({
      ...subName,
      name: `${label}.${name}`,
      nameOwner: owner,
      resolver: subName.resolver ?? DEFAULT_RESOLVER,
    }))
    for (const eachSubname of _subNames) {
      await generateWrappedSubname({ accounts, provider, contracts })({ ...eachSubname })
    }
  }
