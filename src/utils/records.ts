import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { shortenAddress } from './utils'

export const recordOptionsToToupleList = (records?: RecordOptions): [string, string][] => {
  return [
    ...(records?.contentHash ? [['contentHash', records.contentHash]] : []),
    ...(records?.texts?.map(({ key, value }) => [key, value]) || []),
    ...(records?.coinTypes?.map(({ key, value }) => [key, shortenAddress(value)]) || []),
  ] as [string, string][]
}
