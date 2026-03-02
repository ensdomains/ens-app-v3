import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

export type VerifierData = {
  label: string
  value: string
  urlFormatter: string
}

// Returns display data for a verification protocol.
// Currently returns null as no verification providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const getVerifierData = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  key: VerificationProtocol,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value: string,
): VerifierData | null => {
  // No verification providers are currently configured
  return null
}
