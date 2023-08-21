import { RecordOptions, contentTypeToEncodeAs, encodeAbi } from '@ensdomains/ensjs/utils'

import { ContentHash, Profile, RecordItem } from '@app/types'

import { GetRecordsReturnType } from '@ensdomains/ensjs/public'
import { contentHashToString } from './contenthash'
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
    ...(records?.texts?.map(({ key, value }) => [key, value!]) || []),
    ...(records?.coins?.map(({ coin, value }) => [String(coin), shortenAddress(value!)]) || []),
  ].map(([key, value]) => (value ? [key, value] : [deleteLabel, key]))
}

export const mergeRecords = (a: RecordItem[] = [], b: RecordItem[] = []): RecordItem[] => {
  return [...a, ...b].reduce<RecordItem[]>((acc, record) => {
    const index = acc.findIndex((r) => r.key === record.key)
    if (index === -1) return [...acc, record]
    acc[index] = { ...acc[index], ...record }
    return acc
  }, [])
}

export const checkRecordsEqual =
  (type: 'texts' | 'coinTypes') =>
  (a: RecordItem[] = [], b: RecordItem[] = []): boolean => {
    if (type === 'coinTypes')
      return Object.values(
        [...a, ...b].reduce<{
          [key: string]: number
        }>((acc, coinType) => {
          const key = `${coinType.coin}-${(coinType as any).addr}`
          if (acc[key]) acc[key] += 1
          else acc[key] = 1
          return acc
        }, {}),
      ).every((count) => count === 2)
    return Object.values(
      [...a, ...b].reduce<{
        [key: string]: number
      }>((acc, text) => {
        const key = `${text.key}-${text.value}`
        if (acc[key]) acc[key] += 1
        else acc[key] = 1
        return acc
      }, {}),
    ).every((count) => count === 2)
  }

export const checkContentHashEqual = (a?: ContentHash, b?: ContentHash): boolean => {
  return contentHashToString(a) === contentHashToString(b)
}

export const checkProfileRecordsEqual = (a: Profile['records'], b: Profile['records']): boolean => {
  if (!checkRecordsEqual('texts')(a?.texts, b?.texts)) return false
  if (!checkRecordsEqual('coinTypes')(a?.coinTypes, b?.coinTypes)) return false
  if (!checkContentHashEqual(a?.contentHash, b?.contentHash)) return false
  return true
}

export const mergeProfileRecords = (a?: Profile['records'], b?: Profile['records']) => {
  const texts = mergeRecords(a?.texts, b?.texts)
  const coinTypes = mergeRecords(a?.coinTypes, b?.coinTypes)
  const contentHash = contentHashToString(b?.contentHash) || contentHashToString(a?.contentHash)
  return {
    texts,
    coinTypes,
    contentHash,
  }
}

export const makeEthRecordItem = (addr: string): RecordItem => {
  return {
    coin: 'ETH',
    key: '60',
    type: 'addr',
    addr,
  } as unknown as RecordItem
}

export const makeProfileRecordsWithEthRecordItem = (
  records: Profile['records'] = {},
  addr?: string,
): Profile['records'] => {
  return {
    ...records,
    coinTypes: mergeRecords(records?.coinTypes, [...(addr ? [makeEthRecordItem(addr)] : [])]),
  }
}

export const  profileRecordsToKeyValue = async (
  records: GetRecordsReturnType<{ name: string; records: { abi: true; contentHash: true; coins: string[]; texts: string[]; } }>
): Promise<RecordOptions> => {
  const contentHash = contentHashToString(records?.contentHash)
  return {
    texts: records?.texts?.map(({ key, value }) => ({ key: key as string, value })),
    coins: records?.coins?.map((coinType) => ({
      coin: coinType.id,
      value: coinType.value,
    })),
    ...(contentHash ? { contentHash } : {}),
    ...(records.abi ? { abi: await encodeAbi({ data: records.abi.abi as any, encodeAs: contentTypeToEncodeAs(records.abi.contentType as 1 | 2 | 4 | 8) }) } : {}),
  }
}

export type RecordMatch =
  | {
      key: string
      type: 'text'
      value: string
    }
  | {
      key: string
      type: 'addr'
      addr: string
    }

export const checkProfileRecordsContains = (records: Profile['records'], match: RecordMatch) => {
  if (match.type === 'text')
    return !!records?.texts?.some(({ key, value }) => key === match.key && value === match.value)
  if (match.type === 'addr')
    return !!records?.coinTypes?.some(
      (coinType) => coinType.key === match.key && (coinType as any).addr === match.addr,
    )
  return false
}
