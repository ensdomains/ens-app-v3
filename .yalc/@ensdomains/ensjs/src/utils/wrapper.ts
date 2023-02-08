import { BigNumber } from '@ethersproject/bignumber'
import { toUtf8Bytes } from '@ethersproject/strings'
import { ENSArgs } from '../index'

export type Expiry = string | number | Date | BigNumber

export const MAX_EXPIRY = BigNumber.from(2).pow(64).sub(1)

export const makeExpiry = async (
  { getExpiry }: ENSArgs<'getExpiry'>,
  name: string,
  expiry?: Expiry,
) => {
  if (expiry) {
    if (expiry instanceof Date) {
      return BigNumber.from(expiry.getTime() / 1000)
    }
    if (expiry instanceof BigNumber) {
      return expiry
    }
    return BigNumber.from(expiry)
  }
  if (name.endsWith('.eth')) {
    const expResponse = await getExpiry(name)
    if (!expResponse?.expiry)
      throw new Error("Couldn't get expiry for name, please provide one.")
    return BigNumber.from(expResponse.expiry.getTime() / 1000)
  }
  return MAX_EXPIRY
}

export const wrappedLabelLengthCheck = (label: string) => {
  const bytes = toUtf8Bytes(label)
  if (bytes.byteLength > 255)
    throw new Error("Label can't be longer than 255 bytes")
}
