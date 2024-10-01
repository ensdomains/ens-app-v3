import {
  isOpenIdVerifiablePresentation,
  parseOpenIdVerifiablePresentation,
} from './utils/parseOpenIdVerifiablePresentation'

export type VerifiedRecord = {
  verified: boolean
  issuer: string
  key: string
  value: string
}

// TODO: Add more formats here
export const parseVerificationData = async (data: unknown): Promise<VerifiedRecord[]> => {
  if (isOpenIdVerifiablePresentation(data)) return parseOpenIdVerifiablePresentation(data)
  return []
}
