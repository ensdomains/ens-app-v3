import { Hash } from 'viem'

export type ParseVerificationDataDependencies = {
  ownerAddress?: Hash
  name?: string
}

export type VerifiedRecord = {
  verified: boolean
  issuer: string
  key: string
  value: string
}

// Parse verification data from any verification provider.
// Currently returns empty array as no providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const parseVerificationData =
  (_dependencies: ParseVerificationDataDependencies) =>
  async (_data: unknown): Promise<VerifiedRecord[]> => {
    // No verification providers are currently configured
    return []
  }
