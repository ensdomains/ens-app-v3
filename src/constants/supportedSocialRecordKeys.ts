export const supportedSocialRecordKeys = [
  'simplex.contact',
  'simplex.channel',
  'com.twitter',
  'com.github',
  'com.discord',
  'org.telegram',
  'email',
] as const

export type SupportedSocialRecordKey = (typeof supportedSocialRecordKeys)[number]
