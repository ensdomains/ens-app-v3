import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

// Returns a display label for a verification protocol.
// Currently throws as no verification providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const labelForVerificationProtocol = (protocol: VerificationProtocol): string => {
  // No verification providers are currently configured
  // This function should only be called with a valid protocol
  throw new Error(`Unknown verification protocol: ${protocol}`)
}
