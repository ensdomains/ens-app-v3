/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { Address,  Hex } from 'viem'

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setResolver, transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, createAccounts, User } from '../../accounts'
import {
  testClient,
  waitForTransaction,
  walletClient,
  publicClient
} from '../../contracts/utils/addTestContracts.js'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname'
import { generateRecords } from './generateRecords'
import { legacyControllerContractConfig } from '../../contracts/utils/legacyControllerContract'
import { privateKeyToAccount } from 'viem/accounts'

const LEGACY_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address as Address
const PUBLIC_RESOLVER = testClient.chain.contracts.publicResolver.address as Address
const DEFAULT_DURATION = 31536000
const DEFAULT_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address as Address

export type Name = {
  label: string
  owner?: User
  manager?: User
  duration?: number
  secret?: Hex
  resolver?: Hex
  addr?: User
  records?: RecordOptions
  subnames?: Omit<LegacySubname, 'name'>[]
}

type Dependencies = {
  accounts: Accounts
}



export const generateLegacyNameWithConfig =
  ({ accounts }: Dependencies) =>
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

    const _owner = accounts.getAddress(owner) as Address
    const _addr = accounts.getAddress(addr) as Address

    // Registration will fail if resolver is not valid. If an invalid resolver is entered
    // we will set the resolver after the name has been registered.
    const hasValidResolver = [LEGACY_RESOLVER, PUBLIC_RESOLVER].includes(resolver)
    // && VALID_RESOLVERS.includes(resolver)
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    console.log('making commitment:', name)

    const ownerAccount = privateKeyToAccount(accounts.getPrivateKey(owner) as Address)

   const commitment = await publicClient.readContract({...legacyControllerContractConfig, functionName:'makeCommitmentWithConfig',  
    args: [ label,
      _owner,
      secret,
      _resolver,
      _addr,]})


    await walletClient.writeContract({...legacyControllerContractConfig,functionName:'commit', args:[commitment],account:ownerAccount})
   

    await testClient.increaseTime({ seconds: 120 })
    await testClient.mine({ blocks: 1 })

    console.log('registering name:', name)
    console.log('registering name:', name)

    const price = await publicClient.readContract({...legacyControllerContractConfig,functionName:'rentPrice', args:[label, BigInt(duration)]})
    await walletClient.writeContract(
    {...legacyControllerContractConfig,functionName:'registerWithConfig',args:[  label,
      _owner,
      BigInt(duration),
      secret,
      _resolver,
      _addr,
     ], value:price,account:ownerAccount}
     
    )

    // Create records
    await generateRecords()({ name: `${label}.eth`, owner, resolver, records })

    // Create subnames
    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
      resolver: subname.resolver ?? _resolver,
    }))
    for (const subname of _subnames) {
      await generateLegacySubname({ accounts })(subname)
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver:', name, resolver)
      const tx = await setResolver(walletClient, {
        name,
        contract: 'registry',
        resolverAddress: resolver,
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const tx = await transferName(walletClient, {
        name,
        newOwnerAddress: createAccounts().getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }

    await testClient.mine({ blocks: 1 })
  }
