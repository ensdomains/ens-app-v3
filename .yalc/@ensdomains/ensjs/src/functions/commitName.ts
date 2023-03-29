import { ENSArgs } from '..'
import { CommitmentParams, makeCommitment } from '../utils/registerHelpers'
import { wrappedLabelLengthCheck } from '../utils/wrapper'

type Params = Omit<CommitmentParams, 'resolver' | 'name'> & {
  resolverAddress?: string
}

export default async function (
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  { resolverAddress, ...params }: Params,
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'eth')
    throw new Error('Currently only .eth TLD registrations are supported')

  wrappedLabelLengthCheck(labels[0])

  const controller = await contracts!.getEthRegistrarController()
  const resolver = await contracts!.getPublicResolver(
    undefined,
    resolverAddress,
  )
  const { secret, commitment } = makeCommitment({
    name,
    resolver,
    ...params,
  })

  return {
    ...(await controller.populateTransaction.commit(commitment)),
    customData: {
      secret,
      commitment,
    },
  }
}
