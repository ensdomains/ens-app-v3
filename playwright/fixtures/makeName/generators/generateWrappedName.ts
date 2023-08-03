/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Contracts } from 'playwright/fixtures/contracts'
import { Provider } from 'playwright/fixtures/provider'

import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { ChildFuses, CombinedFuseInput } from '@ensdomains/ensjs/utils/fuses'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { makeCommitment, makeRegistrationData } from '@ensdomains/ensjs/utils/registerHelpers'

import { NAMEWRAPPER_AWARE_RESOLVERS } from '@app/utils/constants'

import { generateRecords } from './generateRecords'
import { WrappedSubname, generateWrappedSubname } from './generateWrappedSubname'

const DEFAULT_RESOLVER = NAMEWRAPPER_AWARE_RESOLVERS['1337'][0] as `0x${string}`

type Fuse = ChildFuses['fuse']

export type Name = {
  label: string
  owner?: User
  duration?: number
  secret?: string
  resolver?: `0x${string}`
  reverseRecord?: boolean
  fuses?: Fuse[]
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
    console.log('generating wrapped name:', name)

    const _owner = accounts.getAddress(owner)
    const controller = contracts.get('ETHRegistrarController', { signer: owner })

    // Check if resolver is valid
    const hasValidResolver = resolver && NAMEWRAPPER_AWARE_RESOLVERS['1337'].includes(resolver)
    const resolverAddress = hasValidResolver ? resolver : DEFAULT_RESOLVER
    const _resolver = contracts.get('PublicResolver', {
      address: resolverAddress,
      signer: owner,
    }) as PublicResolver

    const _fuses = fuses
      ? ({
          named: fuses,
        } as CombinedFuseInput['child'])
      : undefined

    console.log('making commitment:', name)
    const { commitment } = makeCommitment({
      name,
      owner: _owner,
      duration,
      secret,
      records,
      reverseRecord,
      fuses: _fuses,
      resolver: _resolver,
    })
    const commitTx = await controller.commit(commitment)
    await commitTx.wait()

    await provider.increaseTime(120)
    await provider.mine()

    console.log('registering name:', name)
    const price = await controller.rentPrice(label, duration)
    const registrationTx = await controller.register(
      ...makeRegistrationData({
        name,
        owner: _owner,
        duration,
        secret,
        records,
        reverseRecord,
        resolver: _resolver,
        fuses: _fuses,
      }),
      {
        value: price[0],
      },
    )
    await registrationTx.wait()

    const _subnames = (subnames || []).map((subname) => ({
      ...subname,
      name: `${label}.eth`,
      nameOwner: owner,
      resolver: subname.resolver ?? resolverAddress,
    }))
    for (const subname of _subnames) {
      await generateWrappedSubname({ accounts, provider, contracts })({ ...subname })
    }

    if (records) {
      await generateRecords({ contracts })({
        name: `${label}.eth`,
        owner,
        resolver: _resolver.address as `0x${string}`,
        records,
      })
    }

    if (!hasValidResolver && resolver) {
      console.log('setting resolver: ', name, resolver)
      const nameWrapper = contracts.get('NameWrapper', { signer: owner })
      const node = namehash(`${label}.eth`)
      const nameWrapperTx = await nameWrapper.setResolver(node, resolver)
      await nameWrapperTx.wait()
    }

    await provider.mine()
  }
