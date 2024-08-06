import { DecodedText } from '@ensdomains/ensjs/dist/types/types'

import { SupportedSocialRecordKey } from '@app/constants/supportedSocialRecordKeys'

import { normaliseTwitterRecordValue } from './normaliseTwitterRecordValue'

/* eslint-disable @typescript-eslint/naming-convention */
const NORMALISED_RECORD_KEY_MAPPING: { [key: string]: SupportedSocialRecordKey } = {
  twitter: 'com.twitter',
  x: 'com.twitter',
  'com.x': 'com.twitter',
  github: 'com.github',
  telegram: 'org.telegram',
  discord: 'com.discord',
}
/* eslint-enable @typescript-eslint/naming-convention */

export const normaliseProfileAccountsKey = (key: string) =>
  NORMALISED_RECORD_KEY_MAPPING[key] ?? key

export const normaliseProfileAccountsValue = ({
  key,
  value,
}: Record<'key' | 'value', string>): string => {
  if (key === 'com.twitter') return normaliseTwitterRecordValue(value)
  return value
}

export type NormalisedAccountsRecord = DecodedText & { normalisedKey: string }

export const normaliseProfileAccountsRecord = ({
  key,
  value,
  ...rest
}: DecodedText): NormalisedAccountsRecord => {
  const normalisedKey = normaliseProfileAccountsKey(key)
  return {
    key,
    normalisedKey,
    value: normaliseProfileAccountsValue({ key: normalisedKey, value }),
    ...rest,
  }
}
