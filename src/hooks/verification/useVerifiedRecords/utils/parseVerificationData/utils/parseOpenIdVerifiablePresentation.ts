/* eslint-disable @typescript-eslint/naming-convention */
import type { VerifiableCredential } from '@app/types/verification'

import {
  parseVerifiableCredential,
  ParseVerifiedCredentialDependencies,
} from '../../parseVerifiedCredential'
import type { VerifiedRecord } from '../parseVerificationData'

export type OpenIdVerifiablePresentation = {
  vp_token: VerifiableCredential | VerifiableCredential[] | undefined
}

export const isOpenIdVerifiablePresentation = (
  data?: unknown,
): data is OpenIdVerifiablePresentation => {
  return (
    !!data &&
    typeof data === 'object' &&
    'vp_token' in data &&
    Array.isArray(data.vp_token) &&
    data.vp_token.every((item) => typeof item === 'object')
  )
}

export const parseOpenIdVerifiablePresentation =
  (dependencies: ParseVerifiedCredentialDependencies) =>
  async (data: OpenIdVerifiablePresentation) => {
    const { vp_token } = data
    const credentials = Array.isArray(vp_token) ? vp_token : [vp_token]
    const verifiedRecords = await Promise.all(
      credentials.map(parseVerifiableCredential(dependencies)),
    )
    return verifiedRecords.filter((records): records is VerifiedRecord => !!records)
  }
