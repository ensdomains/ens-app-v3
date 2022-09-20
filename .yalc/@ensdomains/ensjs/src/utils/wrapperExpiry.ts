import { BigNumber } from 'ethers'
import { ENSArgs } from '..'

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
