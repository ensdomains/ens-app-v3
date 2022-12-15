import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { ProfileRecord } from '@app/constants/profileRecordOptions'
import type { RegistrationForm } from '@app/hooks/useRegistrationForm'

export const profileRecordsToRecordOptions = (
  profileRecords: ProfileRecord[] = [],
  clearRecords = false,
): RecordOptions => {
  return profileRecords.reduce<RecordOptions>(
    (options, record) => {
      if (!record.key || !record.value) return options

      const recordItem = {
        key: record.key.trim(),
        value: record.value.trim(),
      }

      if (record.type === 'text') {
        return {
          ...options,
          texts: [...(options.texts?.filter((r) => r.key !== recordItem.key) || []), recordItem],
        }
      }

      if (record.type === 'addr') {
        return {
          ...options,
          coinTypes: [
            ...(options.coinTypes?.filter((r) => r.key !== recordItem.key) || []),
            recordItem,
          ],
        }
      }

      if (record.type === 'contenthash') {
        return {
          ...options,
          contentHash: recordItem.value,
        }
      }

      return options
    },
    {
      clearRecords: !!clearRecords,
    },
  )
}

export const registrationFormToProfileRecords = (data: RegistrationForm): ProfileRecord[] => {
  return [
    ...data.records,
    ...(data.avatar
      ? [
          {
            key: 'avatar',
            type: 'text',
            group: 'media',
            value: data.avatar,
          } as ProfileRecord,
        ]
      : []),
  ]
}

export const profileRecordsToRegistrationForm = (records: ProfileRecord[]): RegistrationForm => {
  const avatar = records?.find((r) => r.key === 'avatar' && r.group === 'media')?.value
  const recordsWithNoMedia = records
    ?.filter((r) => r.group !== 'media')
    .map((r) => ({
      ...r,
      value: r.value || '',
    }))
  return {
    avatar,
    records: recordsWithNoMedia,
  }
}
