import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ENSArgs } from '..'
import { MAX_INT_64 } from '../utils/consts'
import { labelhash } from '../utils/labels'
import { namehash } from '../utils/normalise'

type BaseProps = {
  duration: number
  value: BigNumber
}

type WrappedProps = {
  duration: BigNumberish
}

export async function extendWrappedName(
  { contracts }: ENSArgs<'contracts'>,
  name: string,
  options?: WrappedProps,
) {
  const expiry = options?.duration || MAX_INT_64
  const labels = name.split('.')
  const labelHash = labelhash(labels.shift()!)
  const parentNode = namehash(labels.join('.'))

  const nameWrapper = await contracts!.getNameWrapper()
  return nameWrapper.populateTransaction.extendExpiry(
    parentNode,
    labelHash,
    expiry,
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
