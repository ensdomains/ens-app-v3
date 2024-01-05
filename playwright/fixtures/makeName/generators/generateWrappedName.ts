/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User, createAccounts } from '../../accounts'
import { Contracts } from '../../contracts'
import { Provider } from '../../provider'
import { EncodeChildFusesInputObject } from '@ensdomains/ensjs/utils'
import { RecordOptions } from '@ensdomains/ensjs/utils'

// import { NAMEWRAPPER_AWARE_RESOLVERS } from '@app/utils/constants' //TODO (SG) - Ask about this

import { generateRecords } from './generateRecords'
import { WrappedSubname, generateWrappedSubname } from './generateWrappedSubname'
import { RegistrationParameters } from '@ensdomains/ensjs/utils'
import { publicClient, testClient, waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts'
import { commitName, registerName, setResolver } from '@ensdomains/ensjs/wallet'
import { getPrice } from '@ensdomains/ensjs/public'
import { KNOWN_RESOLVER_DATA } from '../../../../src/constants/resolverAddressData';

// const DEFAULT_RESOLVER = NAMEWRAPPER_AWARE_RESOLVERS['1337'][0] as `0x${string}` //TODO (SG) - Ask about this
const DEFAULT_RESOLVER = testClient.chain.contracts.ensPublicResolver.address //TODO (SG) Not sure what resolver to use here

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
    reverseRecord = false,
    fuses,
    records,
    subnames,
  }: Name) => {
    const name = `${label}.eth`    
    const _owner = createAccounts().getAddress(owner) as `0x${string}`
    console.log('generating wrapped name:', name, 'with owner:', _owner)

    // Check if resolver is valid
    // const hasValidResolver = !!KNOWN_RESOLVER_DATA['1337']?.find((resolverData) => resolverData.address === resolver)?.isNameWrapperAware
    const hasValidResolver = true
    // && NAMEWRAPPER_AWARE_RESOLVERS['1337'].includes(resolver) //TODO (SG) - Ask about this
    // const resolverAddress = hasValidResolver ? resolver : DEFAULT_RESOLVER
    // const _resolver = contracts.get('PublicResolver', {
    //   address: resolverAddress,
    //   signer: owner, 
    // }) as PublicResolver //TODO (SG) - Ask about this
    const _resolver = hasValidResolver ? resolver : DEFAULT_RESOLVER

    console.log('making commitment:', name)

    const params: RegistrationParameters = {
        name: name,
        duration: duration,
        owner: _owner as `0x${string}`,
        secret: secret as `0x${string}`,
        fuses: fuses,
        resolverAddress: _resolver as `0x${string}`,
      }
      const commitTx = await commitName(walletClient, {
        ...params,
        account: _owner as `0x${string}`  ,
      })
      const commitReceipt = await waitForTransaction(commitTx)
    
      // TODO: Explain why 120 is needed to SG.
      await testClient.increaseTime({ seconds: 120 }) // I use 120 because sometimes with anvil you need to wait a bit longer when registering multiple names at once
      await testClient.mine({ blocks: 1 })
    
      const price = await getPrice(walletClient, {
        nameOrNames:params.name,
        duration: params.duration,
      })
      const total = price!.base + price!.premium
    
      const tx = await registerName(walletClient, {
        ...params,
        account: _owner as `0x${string}`,
        value: total,
      })
      const receipt = await waitForTransaction(tx)
      

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
      await generateRecords({ contracts })({
        name: name,
        owner,
        resolver: _resolver as `0x${string}`,
        records,
      })
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver: ', name, resolver)
      const tx = await setResolver(walletClient, {
        name: name,
        contract: 'nameWrapper',
        resolverAddress: resolver,
        account: _owner as `0x${string}`,
      })
      const receipt = await waitForTransaction(tx)
    }

    await provider.mine()
  }