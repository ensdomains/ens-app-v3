/* eslint-disable @typescript-eslint/no-unused-vars */
import type { VerifiableCredential } from '@app/types/verification'

import type { VerifiedRecord } from './parseVerificationData/parseVerificationData'

export type ParseVerifiedCredentialDependencies = {
  ownershipVerified: boolean
}

// Parse a verifiable credential into a verified record.
// Currently returns null as no verification providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const parseVerifiableCredential =
  (dependencies: ParseVerifiedCredentialDependencies) =>
  async (verifiableCredential?: VerifiableCredential): Promise<VerifiedRecord | null> => {
    // No verification providers are currently configured
    return null
  }
