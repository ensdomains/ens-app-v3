import type { BigNumber } from 'ethers'
import { ENSArgs } from '..'

export default async function (
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  {
    duration,
    value,
  }: {
    duration: number
    value: BigNumber
  },
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'eth')
    throw new Error('Currently only .eth TLD renewals are supported')

  const controller = await contracts!.getEthRegistrarController()

  return controller.populateTransaction.renew(labels[0], duration, { value })
}
