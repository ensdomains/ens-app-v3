/**
 * NOTE: This generator uses register/commit methods to generate names. It is not used in a test yet so it might
 * have some bugs.
 */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, createAccounts, User } from '../../accounts'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname'
import { legacyControllerContractConfig } from '../../contracts/utils/legacyControllerContract'
import { Address, Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const DEFAULT_DURATION = 31536000

export type Name = {
  label: string
  owner?: User
  manager?: User
  duration?: number
  secret?: Hex
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  accounts: Accounts
}

export const generateLegacyName =
  ({ accounts }: Dependencies) =>
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
    const _owner = accounts.getAddress(owner) as Address


    const ownerAccount = privateKeyToAccount(accounts.getPrivateKey(owner) as Address)


    console.log('make commit:', name)
    const commitment = await publicClient.readContract({...legacyControllerContractConfig,functionName:'makeCommitment',args:[label, _owner, secret]})

    await walletClient.writeContract({...legacyControllerContractConfig,functionName:'commit',args:[commitment]})

    await testClient.increaseTime({ seconds: 60 })
    await testClient.mine({ blocks: 1 })

    console.log('register name:', name)
    const price = await publicClient.readContract({...legacyControllerContractConfig,functionName:'rentPrice', args:[label, BigInt(duration)]})
    
    await walletClient.writeContract(
      {...legacyControllerContractConfig,functionName:'register',args:[  label,
        _owner,
        BigInt(duration),
        secret,
       ], value:price,account:ownerAccount}
       
      )

    // Create subnames
    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
    }))
    for (const subname of _subnames) {
      await generateLegacySubname({ accounts })(subname)
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

    await testClient.increaseTime({ seconds: 61 })
    await testClient.mine({ blocks: 1 })
  }
