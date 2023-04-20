import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { shortenAddress } from './utils'

const contentHashTouple = (contentHash?: string, deleteLabel = 'delete'): [string, string][] => {
  if (typeof contentHash !== 'string') return []
  if (contentHash.length === 0) return [[deleteLabel, 'contenthash']]
  return [['contenthash', contentHash]]
}

export const recordOptionsToToupleList = (
  records?: RecordOptions,
  deleteLabel = 'delete',
): [string, string][] => {
  return [
    ...contentHashTouple(records?.contentHash, deleteLabel),
    ...(records?.texts?.map(({ key, value }) => [key, value]) || []),
    ...(records?.coinTypes?.map(({ key, value }) => [key, shortenAddress(value)]) || []),
  ].map(([key, value]) => (value ? [key, value] : [deleteLabel, key]))
}
