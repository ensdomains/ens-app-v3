/* eslint-disable @typescript-eslint/naming-convention */
import type { VerifiableCredential } from '@app/types/verification'

import { parseVerifiableCredential } from '../../parseVerifiedCredential'
import type { VerifiedRecord } from '../parseVerificationData'

export type OpenIdVerifiablePresentation = {
  vp_token: VerifiableCredential | VerifiableCredential[]
}

export const isOpenIdVerifiablePresentation = (
  data: unknown,
): data is OpenIdVerifiablePresentation => {
  return !!data && typeof data === 'object' && 'vp_token' in data
}

export const parseOpenIdVerifiablePresentation = async (data: OpenIdVerifiablePresentation) => {
  const { vp_token } = data
  const credentials = Array.isArray(vp_token) ? vp_token : [vp_token]
  const verifiedRecrods = await Promise.all(credentials.map(parseVerifiableCredential))

  console.log('>>>>>>', verifiedRecrods)
  return verifiedRecrods.filter((records): records is VerifiedRecord => !!records)
}
