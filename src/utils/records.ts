import { BigNumberish } from '@ethersproject/bignumber'

import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { ContentHash, Profile, RecordItem } from '@app/types'

import { contentHashToString } from './contenthash'
import { shortenAddress } from './utils'

const contentHashTouple = (contentHash?: string, deleteLabel = 'delete'): [string, string][] => {
  if (typeof contentHash !== 'string') return []
  if (contentHash.length === 0) return [[deleteLabel, 'contenthash']]
  return [['contenthash', contentHash]]
}

type ABIItem = { contentType?: BigNumberish; data: string | object }
const abiTouple = (abi?: ABIItem, deleteLabel = 'delete'): [string, string][] => {
  if (!abi) return []
  if (!abi.data) return [[deleteLabel, 'abi']]
  const data = typeof abi.data === 'object' ? JSON.stringify(abi.data) : abi.data
  const _abi = data.length > 15 ? `${data.slice(0, 6)}...${data.slice(-6)}` : data
  return [['abi', _abi]]
}

export const recordOptionsToToupleList = (
  records?: RecordOptions,
  deleteLabel = 'delete',
): [string, string][] => {
  return [
    ...(records?.texts?.map(({ key, value }) => [key, value]) || []),
    ...(records?.coinTypes?.map(({ key, value }) => [key, shortenAddress(value)]) || []),
    ...contentHashTouple(records?.contentHash, deleteLabel),
    ...abiTouple(records?.abi, deleteLabel),
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

type ABI = Profile['records']['abi']

export const checkAbiEqual = (abi1?: ABI, abi2?: ABI): boolean => {
  return abi1?.contentType === abi2?.contentType && abi1?.data === abi2?.data
}

export const checkProfileRecordsEqual = (
  a?: Profile['records'],
  b?: Profile['records'],
): boolean => {
  if (!a || !b) return false
  if (!checkRecordsEqual('texts')(a?.texts, b?.texts)) return false
  if (!checkRecordsEqual('coinTypes')(a?.coinTypes, b?.coinTypes)) return false
  if (!checkContentHashEqual(a?.contentHash, b?.contentHash)) return false
  if (!checkAbiEqual(a?.abi, b?.abi)) return false
  return true
}

export const mergeProfileRecords = (a?: Profile['records'], b?: Profile['records']) => {
  const texts = mergeRecords(a?.texts, b?.texts)
  const coinTypes = mergeRecords(a?.coinTypes, b?.coinTypes)
  const contentHash = contentHashToString(b?.contentHash) || contentHashToString(a?.contentHash)
  const abi = b?.abi || a?.abi
  return {
    texts,
    coinTypes,
    contentHash,
    abi,
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

export const profileRecordsToKeyValue = (
  records: Profile['records'],
  abi?: { data: string; contentType: number },
) => {
  const contentHash = contentHashToString(records?.contentHash)
  return {
    texts: records?.texts?.map(({ key, value }) => ({ key: key as string, value })),
    coinTypes: records?.coinTypes?.map((coinType) => ({
      key: coinType.key as string,
      value: (coinType as any).addr,
    })),
    ...(contentHash ? { contentHash } : {}),
    ...(abi ? { abi } : {}),
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
