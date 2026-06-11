// SNRC: simplex.contact / simplex.channel are intentionally NOT here — they
// live in their own category (see supportedSimplexRecordKeys, issue #10).
export const supportedSocialRecordKeys = [
  'com.twitter',
  'com.github',
  'com.discord',
  'org.telegram',
  'email',
] as const

export type SupportedSocialRecordKey = (typeof supportedSocialRecordKeys)[number]
