/**
 * NOTE: This generator uses register/commit methods to generate names. It is not used in a test yet so it might
 * have some bugs.
 */

/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { encodeFunctionData, Hash, hexToBigInt } from 'viem'

import { transferName } from '@ensdomains/ensjs/wallet'

import { Accounts, createAccounts, User } from '../../accounts.js'
import { Contracts } from '../../contracts/index.js'
import {
  publicClient,
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts.js'
import { Provider } from '../../provider.js'
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
  provider: Provider
  accounts: Accounts
  contracts: Contracts
}

export const isLegacyName = (name: Name): name is LegacyName => name.type === 'legacy-register'

const nameWithDefaults = (name: LegacyName) => ({
  ...name,
  duration: name.duration ?? 31536000,
  secret: name.secret ?? '0x0000000000000000000000000000000000000000000000000000000000000000',
  owner: name.owner ?? 'user',
  manager: name.manager ?? name.owner ?? 'user',
})

export const makeLegacyNameGenerator = ({ provider, accounts, contracts }: Dependencies) => ({
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
        args: [label, accounts.getAddress(owner), duration, secret],
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
    //  await Promise.all(subnames.map((subname) => {
    //   return generateLegacySubname({ accounts, contracts })({
    //     ...subname,
    //     name: `${label}.eth`,
    //     nameOwner: owner
    //   })
    //  }))
    for (let subname of subnames) {
      return await generateLegacySubname({ accounts, contracts })({
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
  generate: async ({
    label,
    owner = 'user',
    manager,
    duration = DEFAULT_DURATION,
    // eslint-disable-next-line no-restricted-syntax
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    subnames,
  }: LegacyName) => {
    const name = `${label}.eth`
    console.log('generating legacy name:', name)
    const _owner = accounts.getAddress(owner)

    console.log('make commit:', name)
    const controller = contracts.get('LegacyETHRegistrarController', { signer: owner })
    const commitment = await controller.makeCommitment(label, _owner, secret)
    const commitTx = await controller.commit(commitment)
    await commitTx.wait()

    await provider.increaseTime(60)
    await provider.mine()

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
        newOwnerAddress: createAccounts().getAddress(manager) as `0x${string}`,
        contract: 'registry',
        account: createAccounts().getAddress(owner) as `0x${string}`,
      })
      await waitForTransaction(tx)
    }

    await testClient.increaseTime({ seconds: 61 })
    await testClient.mine({ blocks: 1 })
  },
})
