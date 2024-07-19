import { normaliseTwitterRecordValue } from '@app/utils/records/normaliseTwitterRecordValue'

import { SupportedSocialRecordKey } from '../../../../constants/supportedSocialRecordKeys'
import type { DentityVPTokenReturnType } from './fetchDentityVPToken'

// TODO: Finish when token is updated with username

type VerifiedRecordsKeys = SupportedSocialRecordKey | 'personhood'

type ParseVPTokenReturnType = { [key in VerifiedRecordsKeys]: string }

type VPToken = DentityVPTokenReturnType['vp_token']

type Credential = VPToken[number]

type BaseCredential<Issuer extends string, T extends { [key: string]: string }> = Credential & {
  credentialSubject: {
    credentialIssuer: Issuer
  } & T
}

type TwitterCredentials = BaseCredential<
  'Twiiter' | 'X',
  {
    name: string
    username: string
  }
>

const isTwitterCredential = (credential: Credential): credential is TwitterCredentials =>
  ['twitter', 'x'].includes(credential?.credentialSubject?.credentialIssuer?.toLowerCase())

type DiscordCredentials = BaseCredential<
  'Discord',
  {
    credentialIssuer: 'Discord'
    name: string
  }
>

const isDiscordCredential = (credential: Credential): credential is DiscordCredentials =>
  credential?.credentialSubject?.credentialIssuer?.toLowerCase() === 'discord'

type IdCredentials = BaseCredential<
  '',
  {
    documentVerified: string
  }
>

type GithubCredential = BaseCredential<
  'Github',
  {
    credentialIssuer: 'Github'
  }
>

const isGithubCredential = (credential: Credential): credential is GithubCredential =>
  credential?.credentialSubject?.credentialIssuer?.toLowerCase() === 'github'

const isIdCredential = (credential: Credential): credential is IdCredentials =>
  !!credential?.credentialSubject?.documentVerified

type TelegramCredential = BaseCredential<'Telegram', {}>

const isTelegramCredential = (credential: Credential): credential is TelegramCredential =>
  credential?.credentialSubject?.verificationSource?.toLowerCase() === 'telegram'

export const parseVPToken = (vpToken: VPToken = []): ParseVPTokenReturnType => {
  return Object.fromEntries(
    vpToken
      .map((credential) => {
        if (isTwitterCredential(credential))
          return [
            'com.twitter',
            normaliseTwitterRecordValue(credential.credentialSubject.username),
          ] as [VerifiedRecordsKeys, string]
        if (isDiscordCredential(credential))
          return ['com.discord', credential.credentialSubject.name] as [VerifiedRecordsKeys, string]
        if (isTelegramCredential(credential))
          return ['org.telegram', credential.credentialSubject.name] as [
            VerifiedRecordsKeys,
            string,
          ]
        if (isIdCredential(credential))
          return ['personhood', 'true'] as [VerifiedRecordsKeys, string]
        if (isGithubCredential(credential))
          return ['com.github', credential.credentialSubject.name] as [VerifiedRecordsKeys, string]
        return null
      })
      .filter((entryOrNull): entryOrNull is [VerifiedRecordsKeys, string] => !!entryOrNull),
  ) as ParseVPTokenReturnType
}
