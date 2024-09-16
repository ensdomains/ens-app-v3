import { Hash } from 'viem'

import {
  isDentityVerifiablePresentation,
  parseDentityVerifiablePresentation,
} from './utils/parseDentityVerifiablePresentation'

export type ParseVerificationDataDependencies = {
  ownerAddress?: Hash
  name?: string
}

export type VerifiedRecord = {
  verified: boolean
  issuer: string
  key: string
  value: string
}

// TODO: Add more formats here
export const parseVerificationData =
  (dependencies: ParseVerificationDataDependencies) =>
  async (data: unknown): Promise<VerifiedRecord[]> => {
    if (isDentityVerifiablePresentation(data))
      return parseDentityVerifiablePresentation(dependencies)(data)
    return []
  }
