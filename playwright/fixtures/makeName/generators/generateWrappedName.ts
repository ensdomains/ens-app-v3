/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */

import { getPrice } from '@ensdomains/ensjs/public'
import {
  EncodeChildFusesInputObject,
  RecordOptions,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'
import { commitName, registerName, setResolver } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import { Contracts } from '../../contracts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts'
import { Provider } from '../../provider'
import { generateRecords } from './generateRecords'
import { generateWrappedSubname, WrappedSubname } from './generateWrappedSubname'

const DEFAULT_RESOLVER = testClient.chain.contracts.ensPublicResolver.address

export type Name = {
  label: string
  owner?: User
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  reverseRecord?: boolean
  fuses?: EncodeChildFusesInputObject
  addr?: `0x${string}`
  records?: RecordOptions
  subnames?: Omit<WrappedSubname, 'name' | 'nameOwner'>[]
  offset?: number
}

type Dependencies = {
  accounts: Accounts
  provider: Provider
  contracts: Contracts
}

export const generateWrappedName =
  ({ accounts, provider, contracts }: Dependencies) =>
  async ({
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
  }: Name) => {
    const name = `${label}.eth`
    const _owner = accounts.getAddress(owner) as `0x${string}`
    console.log('generating wrapped name:', name, 'with owner:', _owner)

    const ownerAccount = accounts.getAccount(owner)

    const hasValidResolver =
      resolver.toLocaleLowerCase() ===
      testClient.chain.contracts.ensPublicResolver.address.toLowerCase()
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    console.log('making commitment:', name)

    const params: RegistrationParameters = {
      name,
      duration,
      owner: ownerAccount.address,
      secret: secret as `0x${string}`,
      fuses,
      resolverAddress: _resolver as `0x${string}`,
    }
    const commitTx = await commitName(walletClient, {
      ...params,
      account: ownerAccount,
    })
    await waitForTransaction(commitTx)

    await testClient.increaseTime({ seconds: 120 }) // I use 120 because sometimes with anvil you need to wait a bit longer when registering multiple names at once
    await walletClient.mine({ account: ownerAccount })

    const price = await getPrice(walletClient, {
      nameOrNames: params.name,
      duration: params.duration,
    })
    const total = price!.base + price!.premium

    const tx = await registerName(walletClient, {
      ...params,
      account: ownerAccount,
      value: total,
      gas: 1000000n,
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
      await generateRecords({ accounts })({
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
        account: ownerAccount,
      })
      await waitForTransaction(resolverTx)
    }

    await walletClient.mine({ account: ownerAccount })
  }
