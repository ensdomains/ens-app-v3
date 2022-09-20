import { BigNumber } from 'ethers'
import { ENSArgs } from '..'
import {
  CommitmentParams,
  makeRegistrationData,
} from '../utils/registerHelpers'

type Params = Omit<CommitmentParams, 'name' | 'resolver'> & {
  resolverAddress?: string
  secret: string
  value: BigNumber
}

export default async function (
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  { resolverAddress, value, ...params }: Params,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'eth')
    throw new Error('Currently only .eth TLD registrations are supported')

  const controller = await contracts!.getEthRegistrarController()
  const _resolver = await contracts!.getPublicResolver(
    undefined,
    resolverAddress,
  )
  const generatedParams = makeRegistrationData({
    name,
    resolver: _resolver,
    ...params,
  })

  return controller.populateTransaction.register(...generatedParams, {
    value,
  })
}
