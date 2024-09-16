import { type ParseVerificationDataDependencies } from '../parseVerificationData'
import {
  isOpenIdVerifiablePresentation,
  OpenIdVerifiablePresentation,
  parseOpenIdVerifiablePresentation,
} from './parseOpenIdVerifiablePresentation'

export const isDentityVerifiablePresentation = (
  data: unknown,
): data is OpenIdVerifiablePresentation => {
  if (!isOpenIdVerifiablePresentation(data)) return false
  const credentials = Array.isArray(data.vp_token) ? data.vp_token : [data.vp_token]
  return credentials.some((credential) => credential?.type.includes('VerifiedENS'))
}

export const parseDentityVerifiablePresentation =
  ({ ownerAddress }: ParseVerificationDataDependencies) =>
  async (data: OpenIdVerifiablePresentation) => {
    const credentials = Array.isArray(data.vp_token) ? data.vp_token : [data.vp_token]
    const ownershipVerified = credentials.some(
      (credential) =>
        !!credential &&
        credential.type.includes('VerifiedENS') &&
        credential.credentialSubject?.ethAddress?.toLowerCase() === ownerAddress?.toLowerCase(),
    )
    return parseOpenIdVerifiablePresentation({ ownershipVerified })(data)
  }
