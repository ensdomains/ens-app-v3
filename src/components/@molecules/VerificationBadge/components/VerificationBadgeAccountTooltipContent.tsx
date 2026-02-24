import { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

type Props = { verifiers?: VerificationProtocol[] }

// Displays tooltip content for a verification badge showing the issuer.
// Currently returns null as no verification providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const VerificationBadgeAccountTooltipContent = ({ verifiers: _verifiers }: Props) => {
  // No verification providers are currently configured
  return null
}
