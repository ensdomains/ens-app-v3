import { isHex, pad } from 'viem'

import { getAddressRecord, getOwner } from '@ensdomains/ensjs/public'
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

/**
 * Resolves a referrer (ENS name or hex address) to a 32-byte hex value.
 *
 * Resolution flow for ENS names:
 * 1. Try to get ETH address record from the name
 * 2. If no address record, fall back to owner/registrant address
 * 3. Convert the resolved address to 32-byte hex
 *
 * @param client - Viem client for blockchain queries
 * @param referrer - ENS name (e.g., 'vitalik.eth') or hex address
 * @returns 32-byte hex string or null if resolution fails
 */
export const resolveReferrerToHex = async (
  client: ClientWithEns,
  referrer: string | undefined,
): Promise<`0x${string}` | null> => {
  if (!referrer) return null

  // If it's already a valid hex string, just pad it
  if (isHex(referrer)) {
    const paddedHex = getReferrerHex(referrer)
    return paddedHex === EMPTY_BYTES32 ? null : paddedHex
  }

  // Try to resolve as ENS name
  try {
    // Step 1: Try to get ETH address record
    const addressRecord = await getAddressRecord(client, { name: referrer })

    if (addressRecord?.value) {
      // Found address record, convert to hex
      return getReferrerHex(addressRecord.value)
    }

    // Step 2: Fall back to owner/registrant
    const ownerData = await getOwner(client, { name: referrer })

    if (ownerData?.owner) {
      // Found owner, convert to hex
      return getReferrerHex(ownerData.owner)
    }

    // No address record and no owner
    return null
  } catch (error) {
    console.error('Failed to resolve referrer ENS name:', error)
    return null
  }
}
