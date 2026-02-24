import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

// Returns display data for a verification protocol.
// Currently returns null as no verification providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const getVerifierData = (_key: VerificationProtocol, _value: string) => {
  // No verification providers are currently configured
  return null
}
