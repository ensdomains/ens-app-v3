import { BigNumber, BigNumberish } from 'ethers'
import { ENSArgs } from '..'
import { FuseProps, validateFuses } from '../utils/fuses'
import { MAX_INT_64 } from '../utils/registerHelpers'

type BaseProps = {
  duration: number
  value: BigNumber
}

export async function renewNameWithData(
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  {
    duration,
    value,
    fuses,
    wrapperExpiry = MAX_INT_64,
  }: BaseProps & {
    fuses?: FuseProps
    wrapperExpiry?: BigNumberish
  },
) {
  const labels = name.split('.')
  if (labels.length !== 2 || labels[1] !== 'eth') {
    throw new Error('Currently only .eth TLD renewals are supported')
  }

  const encodedFuses = fuses ? validateFuses(fuses) : 0
  const controller = await contracts!.getEthRegistrarController()
  return controller.populateTransaction.renewWithFuses(
    labels[0],
    duration,
    encodedFuses,
    wrapperExpiry,
    { value },
  )
}

export default async function (
  { contracts }: ENSArgs<'contracts'>,
  nameOrNames: string | string[],
  { duration, value }: BaseProps,
) {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
  const labels = names.map((name) => {
    const label = name.split('.')
    if (label.length !== 2 || label[1] !== 'eth') {
      throw new Error('Currently only .eth TLD renewals are supported')
    }
    return label[0]
  })

  if (labels.length === 1) {
    const controller = await contracts!.getEthRegistrarController()
    return controller.populateTransaction.renew(labels[0], duration, { value })
  }
  const bulkRenewal = await contracts!.getBulkRenewal()
  return bulkRenewal.populateTransaction.renewAll(labels, duration, { value })
}
