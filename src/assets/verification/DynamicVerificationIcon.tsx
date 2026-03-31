import { VerificationProtocol } from '../../transaction-flow/input/VerifyProfile/VerifyProfile-flow'

// Map of verification protocol icons.
// Currently empty as no verification providers are configured.
// The infrastructure is designed to support multiple identity providers in the future.
export const verificationIconTypes: Record<string, any> = {}

export const DynamicVerificationIcon = ({ name }: { name: VerificationProtocol }) => {
  if (name in verificationIconTypes) {
    const Icon = verificationIconTypes[name]
    if (Icon) {
      return <Icon width={20} height={20} />
    }
  }
  return null
}
