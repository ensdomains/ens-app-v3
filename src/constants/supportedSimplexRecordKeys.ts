// SNRC: SimpleX links are a first-class category, separate from generic socials.
// They get their own "SimpleX Network" profile section (above Accounts) and
// their own group in the add-record flow (above Social). See issue #10.
export const supportedSimplexRecordKeys = ['simplex.contact', 'simplex.channel'] as const

export type SupportedSimplexRecordKey = (typeof supportedSimplexRecordKeys)[number]
