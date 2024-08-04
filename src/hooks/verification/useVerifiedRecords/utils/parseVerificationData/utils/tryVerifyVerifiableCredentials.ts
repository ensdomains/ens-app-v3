import { VerifiableCredential } from '@app/types/verification'

export const tryVerifyVerifiableCredentials = async (data: VerifiableCredential) => {
  try {
    console.log(data)
    return true
  } catch (e) {
    return false
  }
}
