import type { VerificationProtocol } from '@app/transaction-flow/input/VerifyProfile/VerifyProfile-flow'

/**
 * General Verification Constants
 */

export const VERIFICATION_RECORD_KEY = 'verifications'

// Available verification protocols - currently empty, but the infrastructure
// is designed to support multiple identity providers in the future
export const VERIFICATION_PROTOCOLS: VerificationProtocol[] = []
