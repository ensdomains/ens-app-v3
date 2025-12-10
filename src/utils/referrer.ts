import { isHex, pad } from 'viem'

import { getAddressRecord } from '@ensdomains/ensjs/public'
import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

import { ClientWithEns } from '@app/types'

export const getReferrerHex = (referrer: string | undefined): `0x${string}` => {
  if (!referrer) return EMPTY_BYTES32

  // Check if it's a valid hex string using viem's isHex
  if (!isHex(referrer)) {
    return EMPTY_BYTES32
  }

  // Check if the hex string is too long (> 32 bytes)
  const hexLength = (referrer.length - 2) / 2 // Remove '0x' and divide by 2 for byte length
  if (hexLength > 32) {
    return EMPTY_BYTES32
  }

  // Use viem's pad utility to pad to 32 bytes
  return pad(referrer, { size: 32 })
}

export const resolveReferrer = async (
  client: ClientWithEns,
  referrer: string | undefined,
): Promise<`0x${string}` | null> => {
  if (!referrer) return null

  if (isHex(referrer)) {
    const paddedHex = getReferrerHex(referrer)
    return paddedHex === EMPTY_BYTES32 ? null : paddedHex
  }

  try {
    const addressRecord = await getAddressRecord(client, { name: referrer })
    return addressRecord?.value ? getReferrerHex(addressRecord.value) : null
  } catch (error) {
    console.error('Failed to resolve referrer ENS name:', error)
    return null
  }
}
