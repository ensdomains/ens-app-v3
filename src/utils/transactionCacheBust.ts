import { CacheBust } from '@app/hooks/transactions/transactionStore'

import { hasAvatarRecordChange, hasHeaderRecordChange, ProfileRecordItem } from './records'

/**
 * Computes cache bust flags from transaction action name and data.
 * This is called at transaction submission time when the data is still available.
 */
export const computeCacheBustFlags = (action: string, data: unknown): CacheBust | undefined => {
  const txData = data as { name?: string; records?: unknown; previousRecords?: unknown }
  const name = txData?.name

  switch (action) {
    case 'updateProfileRecords': {
      const { records, previousRecords } = txData as {
        records?: ProfileRecordItem[]
        previousRecords?: ProfileRecordItem[]
      }
      if (!records) return name ? { name } : undefined
      return {
        avatar: hasAvatarRecordChange(records, previousRecords),
        header: hasHeaderRecordChange(records, previousRecords),
        name,
      }
    }

    case 'updateProfile':
    case 'registerName': {
      // These use RecordOptions format with texts array
      const { records } = txData as {
        records?: { texts?: Array<{ key: string }> }
      }
      if (!records?.texts) return name ? { name } : undefined
      return {
        avatar: records.texts.some((text) => text.key === 'avatar'),
        header: records.texts.some((text) => text.key === 'header'),
        name,
      }
    }

    case 'migrateProfile':
    case 'migrateProfileWithReset':
      // These copy existing records to a new resolver without changing values.
      // No cache bust needed since avatar/header content remains the same.
      return undefined

    case 'resetProfileWithRecords':
      // This uses clearRecords: true, so any existing avatar/header will be deleted
      // unless explicitly included in the passed records. Always bust to be safe.
      return { avatar: true, header: true, name }

    case 'updateResolver':
    case 'resetProfile':
      // These always bust both caches
      return { avatar: true, header: true, name }

    default:
      return undefined
  }
}
