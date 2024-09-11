export const supportedSocialRecordKeys = [
  'com.twitter',
  'com.github',
  'com.discord',
  'org.telegram',
  'email',
] as const

export type SupportedSocialRecordKey = (typeof supportedSocialRecordKeys)[number]
