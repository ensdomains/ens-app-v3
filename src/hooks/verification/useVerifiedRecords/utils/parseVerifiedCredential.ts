import { match, P } from 'ts-pattern'

import type { VerifiableCredential } from '@app/types/verification'
import { normaliseTwitterRecordValue } from '@app/utils/records/normaliseTwitterRecordValue'

import type { VerifiedRecord } from './parseVerificationData/parseVerificationData'
import { tryVerifyVerifiableCredentials } from './parseVerificationData/utils/tryVerifyVerifiableCredentials'

// TODO: parse issuer from verifiableCredential when dentity fixes their verifiable credentials

export type ParseVerifiedCredentialDependencies = {
  ownershipVerified: boolean
}

export const parseVerifiableCredential =
  ({ ownershipVerified }: ParseVerifiedCredentialDependencies) =>
  async (verifiableCredential?: VerifiableCredential): Promise<VerifiedRecord | null> => {
    if (!verifiableCredential) return null

    const verified = await tryVerifyVerifiableCredentials(verifiableCredential)
    const baseResult = match(verifiableCredential)
      .with(
        {
          type: P.when(
            (type) =>
              type?.includes('VerifiedTwitterAccount') || type?.includes('VerifiedXAccount'),
          ),
        },
        (vc) => ({
          issuer: 'dentity',
          key: 'com.twitter',
          value: normaliseTwitterRecordValue(vc?.credentialSubject?.username),
        }),
      )
      .with({ type: P.when((type) => type?.includes('VerifiedDiscordAccount')) }, (vc) => ({
        issuer: 'dentity',
        key: 'com.discord',
        value: vc?.credentialSubject?.name || '',
      }))
      .with({ type: P.when((type) => type?.includes('VerifiedGithubAccount')) }, (vc) => ({
        issuer: 'dentity',
        key: 'com.github',
        value: vc?.credentialSubject?.name || '',
      }))
      .with({ type: P.when((type) => type?.includes('VerifiedPersonhood')) }, () => ({
        issuer: 'dentity',
        key: 'personhood',
        value: '',
      }))
      .with({ type: P.when((type) => type?.includes('VerifiedTelegramAccount')) }, (vc) => ({
        issuer: 'dentity',
        key: 'org.telegram',
        value: vc?.credentialSubject?.name || '',
      }))
      .with({ type: P.when((type) => type?.includes('VerifiedEmail')) }, (vc) => ({
        issuer: 'dentity',
        key: 'email',
        value: vc?.credentialSubject?.verifiedEmail || '',
      }))
      .with({ type: P.when((type) => type?.includes('VerifiedENS')) }, () => ({
        issuer: 'dentity',
        key: 'ens',
        value: '',
      }))
      .otherwise(() => null)

    if (!baseResult) return null
    return {
      verified: ownershipVerified && verified,
      ...baseResult,
    }
  }
