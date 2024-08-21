import { VerifiableCredential } from '@app/types/verification'

// TODO: Add proper verification logic
export const tryVerifyVerifiableCredentials = async (data?: VerifiableCredential) => {
  try {
    return !!data
  } catch (e) {
    return false
  }
}
