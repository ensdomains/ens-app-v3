import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { ProfileRecord } from '@app/constants/profileRecordOptions'

export const profileRecordsToRecordOptions = (
  profileRecords: ProfileRecord[] = [],
  clearRecords = false,
): RecordOptions => {
  return profileRecords.reduce<RecordOptions>(
    (options, record) => {
      if (!record.key || !record.value) return options

      const recordItem = {
        key: record.key,
        value: record.value,
      }

      if (record.type === 'text') {
        return {
          ...options,
          texts: [...(options.texts || []), recordItem],
        }
      }

      if (record.type === 'addr') {
        return {
          ...options,
          coinTypes: [...(options.coinTypes || []), recordItem],
        }
      }

      if (record.type === 'contenthash') {
        return {
          ...options,
          contentHash: record.value,
        }
      }

      return options
    },
    {
      clearRecords: !!clearRecords,
    },
  )
}
