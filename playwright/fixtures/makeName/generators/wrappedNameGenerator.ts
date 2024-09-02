/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Hash } from 'viem'

import { getPrice } from '@ensdomains/ensjs/public'
import {
  EncodeChildFusesInputObject,
  RecordOptions,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'
import { commitName, registerName, setResolver, setFuses } from '@ensdomains/ensjs/wallet'

import { Accounts, createAccounts, User } from '../../accounts'
import { Contracts } from '../../contracts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts'
import { Provider } from '../../provider'
import { generateRecords } from './generateRecords'
import { generateWrappedSubname, WrappedSubname } from './generateWrappedSubname'
import { Name } from '../index'

const DEFAULT_RESOLVER = testClient.chain.contracts.ensPublicResolver.address

export type WrappedName = {
  type: 'wrapped'
  label: string
  owner?: User
  duration?: number
  secret?: Hash
  resolver?: Hash
  reverseRecord?: boolean
  fuses?: EncodeChildFusesInputObject
  addr?: Hash
  records?: RecordOptions
  subnames?: Omit<WrappedSubname, 'name' | 'nameOwner'>[]
  offset?: number
}

type Dependencies = {
  accounts: Accounts
  provider: Provider
  contracts: Contracts
}

export const isWrappendName = (name: Name): name is WrappedName => name.type === 'wrapped'

const nameWithDefaults = (name: WrappedName) => ({
  ...name,
  duration: name.duration ?? 31536000,
  secret: name.secret ?? '0x0000000000000000000000000000000000000000000000000000000000000000',
  resolver: name.resolver ?? DEFAULT_RESOLVER,
  owner: name.owner ?? 'user',
})

const getParentFuses = (fuses?: EncodeChildFusesInputObject): EncodeChildFusesInputObject | undefined => {
  if (!fuses) return undefined
  return {
    named: fuses.named?.filter((fuse) => ['CANNOT_UNWRAP'].includes(fuse)) ?? [],
  }
}

const getChildFuses = (fuses?: EncodeChildFusesInputObject): EncodeChildFusesInputObject | undefined => {
  if (!fuses) return undefined
  return {
    named: fuses.named?.filter((fuse) => !['CANNOT_UNWRAP'].includes(fuse)) ?? [],
  }
}

export const makeWrappedNameGenerator = ({ accounts, provider, contracts }: Dependencies) => ({
  commit: async (nameConfig: WrappedName) => {
    const { label, owner, resolver, duration, secret, fuses } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    const parentFuses = getParentFuses(fuses)

    const ownerAddress = accounts.getAddress(owner) as `0x${string}`
    console.log('generating wrapped name:', name, 'with owner:', ownerAddress)

    const hasValidResolver =
      resolver.toLocaleLowerCase() ===
      testClient.chain.contracts.ensPublicResolver.address.toLowerCase()
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    const params: RegistrationParameters = {
      name,
      duration,
      owner: ownerAddress as `0x${string}`,
      secret: secret as `0x${string}`,
      resolverAddress: _resolver as `0x${string}`,
      fuses: parentFuses,
    }

    const data = commitName.makeFunctionData(walletClient, params)

    const prepared = await walletClient.prepareTransactionRequest({
      ...data,
      account: accounts.getAccountForUser(owner),
      gas: 1000000n, // This is necessary to bypass the gas estimation which will throw an error at times because the nonce is off
    })

    return walletClient.sendTransaction(prepared)
  },
  register: async (nameConfig: WrappedName) => {
    const { label, duration, owner, resolver, fuses, secret } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    const parentFuses = getParentFuses(fuses)

    const ownerAddress = accounts.getAddress(owner) as `0x${string}`
    const hasValidResolver =
      resolver.toLocaleLowerCase() ===
      testClient.chain.contracts.ensPublicResolver.address.toLowerCase()
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    const price = await getPrice(walletClient, {
      nameOrNames: name,
      duration: duration,
    })
    const total = price!.base + price!.premium

    console.log('registering name:', name)

    const data = registerName.makeFunctionData(walletClient, {
      name,
      duration,
      owner: ownerAddress,
      secret,
      resolverAddress: _resolver,
      fuses: parentFuses,
      value: total,
    })

    const prepared = await walletClient.prepareTransactionRequest({
      ...data,
      account: accounts.getAccountForUser(owner),
      gas: 1000000n, // This is necessary to bypass the gas estimation which will throw an error at times because of the pending
    })

    return walletClient.sendTransaction(prepared)
  },
  configure: async (nameConfig: WrappedName) => {
    const { label, owner, resolver, records, subnames = [], fuses } = nameWithDefaults(nameConfig)
    const name = `${label}.eth`
    const childFuses = getChildFuses(fuses)
    const ownerAddress = accounts.getAddress(owner) as `0x${string}`
    const hasValidResolver =
      resolver.toLocaleLowerCase() ===
      testClient.chain.contracts.ensPublicResolver.address.toLowerCase()
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    if (records) {
      await generateRecords({ accounts})({
        name,
        owner,
        resolver: _resolver as `0x${string}`,
        records,
      })
    }

    // await Promise.all(subnames.map((subname) => generateWrappedSubname({ accounts, provider, contracts})({
    //   ...subname,
    //   name: `${label}.eth`,
    //   nameOwner: owner,
    //   resolver: subname.resolver ?? _resolver
    // })))

    for (const subname of subnames) {
      await generateWrappedSubname({ accounts, provider, contracts })({
        ...subname,
        name: `${label}.eth`,
        nameOwner: owner,
        resolver: subname.resolver ?? _resolver,
      });
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver: ', name, resolver)
      const resolverTx = await setResolver(walletClient, {
        name,
        contract: 'nameWrapper',
        resolverAddress: resolver,
        account: ownerAddress as `0x${string}`,
      })
      await waitForTransaction(resolverTx)
    }

    if (childFuses) {
      console.log('setting fuses:', name, fuses)
      const fusesTx = await setFuses(walletClient, {
        name,
        fuses: childFuses,
        account: accounts.getAccountForUser(owner),
      })
      await waitForTransaction(fusesTx)
    }
  },
  generate: async ({
    label,
    owner = 'user',
    duration = 31536000,
    // eslint-disable-next-line no-restricted-syntax
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver = DEFAULT_RESOLVER,
    // reverseRecord = false,
    fuses,
    records,
    subnames,
  }: WrappedName) => {
    const name = `${label}.eth`
    const _owner = createAccounts().getAddress(owner) as `0x${string}`
    console.log('generating wrapped name:', name, 'with owner:', _owner)

    const hasValidResolver =
      resolver.toLocaleLowerCase() ===
      testClient.chain.contracts.ensPublicResolver.address.toLowerCase()
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    console.log('making commitment:', name)

    const params: RegistrationParameters = {
      name,
      duration,
      owner: _owner as `0x${string}`,
      secret: secret as `0x${string}`,
      fuses,
      resolverAddress: _resolver as `0x${string}`,
    }
    const commitTx = await commitName(walletClient, {
      ...params,
      account: _owner as `0x${string}`,
    })
    await waitForTransaction(commitTx)

    await testClient.increaseTime({ seconds: 120 }) // I use 120 because sometimes with anvil you need to wait a bit longer when registering multiple names at once
    await testClient.mine({ blocks: 1 })

    const price = await getPrice(walletClient, {
      nameOrNames: params.name,
      duration: params.duration,
    })
    const total = price!.base + price!.premium

    const tx = await registerName(walletClient, {
      ...params,
      account: _owner as `0x${string}`,
      value: total,
    })
    await waitForTransaction(tx)

    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
      resolver: subname.resolver ?? _resolver,
    }))
    for (const subname of _subnames) {
      await generateWrappedSubname({ accounts, provider, contracts })({ ...subname })
    }

    if (records) {
      await generateRecords({ accounts})({
        name,
        owner,
        resolver: _resolver as `0x${string}`,
        records,
      })
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver: ', name, resolver)
      const resolverTx = await setResolver(walletClient, {
        name,
        contract: 'nameWrapper',
        resolverAddress: resolver,
        account: _owner as `0x${string}`,
      })
      await waitForTransaction(resolverTx)
    }

    await provider.mine()
  },
})
