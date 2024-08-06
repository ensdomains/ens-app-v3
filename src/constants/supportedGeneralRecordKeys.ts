export const supportedGeneralRecordKeys = ['name', 'description', 'url', 'location'] as const

export type SupportedGeneralRecordsKey = (typeof supportedGeneralRecordKeys)[number]
