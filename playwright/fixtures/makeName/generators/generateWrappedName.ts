/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { ChildFuses, CombinedFuseInput } from '@ensdomains/ensjs/utils/fuses'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'
import { makeCommitment, makeRegistrationData } from '@ensdomains/ensjs/utils/registerHelpers'

import { NAMEWRAPPER_AWARE_RESOLVERS } from '@app/utils/constants'

import { getContract } from '../utils/getContract'
import { WrappedSubname, generateWrappedSubname } from './generateWrappedSubname'

const DEFAULT_RESOLVER = NAMEWRAPPER_AWARE_RESOLVERS['1337'][0]

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
}

export const generateWrappedName = async (
  {
    label,
    owner = 'user',
    duration = 31536000,
    secret = '0x0000000000000000000000000000000000000000000000000000000000000000',
    resolver,
    reverseRecord = false,
    fuses,
    records,
    subnames,
    offset,
  }: Name,
  { accounts, provider }: Dependencies,
) => {
  const _owner = accounts.getAddress(owner)
  const name = `${label}.eth`
  const signer = provider.getSigner(accounts.getIndex(owner))
  const controller = getContract('ETHRegistrarController', { signer })

  // Check if resolver is valid
  const hasValidResolver = resolver && NAMEWRAPPER_AWARE_RESOLVERS['1337'].includes(resolver)
  const resovlerAddress = hasValidResolver ? resolver : DEFAULT_RESOLVER
  const _resolver = getContract('PublicResolver', {
    address: resovlerAddress,
    signer,
  }) as PublicResolver

  const _fuses = fuses
    ? ({
        named: fuses,
      } as CombinedFuseInput['child'])
    : undefined

  await provider.getTransactionCount(_owner)
  // Commit
  console.log('making commitment')
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
  const tx1 = await controller.commit(commitment)
  await tx1.wait()

  await provider.increaseTime(120)
  await provider.mine()

  // Register
  await provider.getTransactionCount(_owner)
  const price = await controller.rentPrice(label, duration)
  console.log('registering name', price)
  const tx = await controller.register(
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
  await tx.wait()

  // Create subnames
  console.log('creating subnames')
  const _subnames = (subnames || []).map((subname) => ({
    ...subname,
    name: `${label}.eth`,
    nameOwner: owner,
    resolver: undefined,
  }))
  for (const subname of _subnames) {
    await generateWrappedSubname({ ...subname, offset }, { accounts, provider })
  }

  // Force set an invalid resolver
  if (!hasValidResolver && resolver) {
    const nameWrapper = await getContract('NameWrapper', { signer })
    const node = namehash(`${label}.eth`)
    await nameWrapper.setResolver(node, resolver)
  }

  await provider.mine()
}
