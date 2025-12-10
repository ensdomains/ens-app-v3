import { isHex, pad } from 'viem'

import { EMPTY_BYTES32 } from '@ensdomains/ensjs/utils'

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

