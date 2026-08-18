export const supportedGeneralRecordKeys = [
  'name',
  'description',
  'url',
  'location',
  'timezone',
] as const

export type SupportedGeneralRecordsKey = (typeof supportedGeneralRecordKeys)[number]
