/**
 * NOTE: This generator uses register/commit methods to generate names. It is not used in a test yet so it might
 * have some bugs.
 */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { encodeFunctionData, Hash } from 'viem'

import { transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts.js'
import {
  publicClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { legacyEthRegistrarControllerAbi } from '../constants/abis.js'
import { Name } from '../index'
import { getLegacyRentPrice } from '../utils/getLegacyRentPrice.js'
import { generateLegacySubname, LegacySubname } from './generateLegacySubname.js'

const DEFAULT_DURATION = 31536000

export type LegacyName = {
  label: string
  type: 'legacy-register'
  owner?: User
  manager?: User
  duration?: number
  secret?: Hash
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  accounts: Accounts
}

export const isLegacyName = (name: Name): name is LegacyName => name.type === 'legacy-register'

const nameWithDefaults = (name: LegacyName) => ({
  ...name,
  duration: name.duration ?? DEFAULT_DURATION,
  secret: name.secret ?? '0x0000000000000000000000000000000000000000000000000000000000000000',
  owner: name.owner ?? 'user',
  manager: name.manager ?? name.owner ?? 'user',
})

export const makeLegacyNameGenerator = ({ accounts }: Dependencies) => ({
  commit: async (nameConfig: LegacyName) => {
    const { label, owner, secret } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    const ownerAddress = accounts.getAddress(owner)

    console.log('make commit:', name)

    const { data: commitment } = await publicClient.call({
      to: walletClient.chain.contracts.legacyRegistrarController.address,
      data: encodeFunctionData({
        functionName: 'makeCommitment',
        abi: legacyEthRegistrarControllerAbi,
        args: [label, ownerAddress, secret],
      }),
    })

    const preparedTransaction = await walletClient.prepareTransactionRequest({
      to: walletClient.chain.contracts.legacyRegistrarController.address,
      data: encodeFunctionData({
        functionName: 'commit',
        abi: legacyEthRegistrarControllerAbi,
        args: [commitment],
      }),
      gas: 1000000n,
      account: accounts.getAccountForUser(owner),
    })

    return walletClient.sendTransaction(preparedTransaction)
  },
  register: async (nameConfig: LegacyName) => {
    const { label, owner, duration, secret } = nameWithDefaults(nameConfig)

    const ownerAddress = accounts.getAddress(owner)

    const price = await getLegacyRentPrice({ label, duration })

    const preparedTransaction = await walletClient.prepareTransactionRequest({
      to: walletClient.chain.contracts.legacyRegistrarController.address,
      data: encodeFunctionData({
        functionName: 'register',
        abi: legacyEthRegistrarControllerAbi,
        args: [label, ownerAddress, duration, secret],
      }),
      value: price,
      gas: 1000000n,
      account: accounts.getAccountForUser(owner),
    })

    return walletClient.sendTransaction(preparedTransaction)
  },
  configure: async (nameConfig: LegacyName) => {
    const { label, owner, manager, subnames = [], secret } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    
    // Create subnames
    for (const subname of subnames) {
      await generateLegacySubname({ accounts })({
        ...subname,
        name: `${label}.eth`,
        nameOwner: owner,
      })
    }

    if (!!manager && manager !== owner) {
      console.log('setting manager:', name, manager)
      const tx = await transferName(walletClient, {
        name,
        newOwnerAddress: accounts.getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: accounts.getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }
  },
})
