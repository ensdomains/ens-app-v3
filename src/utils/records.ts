import { Address, hexToString } from 'viem'

import { getCoderByCoinName, getCoderByCoinType } from '@ensdomains/address-encoder'
import { GetRecordsReturnType } from '@ensdomains/ensjs/public'
import {
  contentTypeToEncodeAs,
  DecodedContentHash,
  encodeAbi,
  RecordOptions,
} from '@ensdomains/ensjs/utils'

import { testnetNetworks } from '@app/constants/networks'
import { AddressRecord, Profile, TextRecord } from '@app/types'

import { contentHashToString } from './contenthash'
import { shortenAddress } from './utils'

const contentHashTouple = (
  contentHash?: string | null,
  deleteLabel = 'delete',
): [string, string][] => {
  if (typeof contentHash !== 'string') return []
  if (contentHash.length === 0) return [[deleteLabel, 'contenthash']]
  return [['contenthash', contentHash]]
}

const abiTouple = (abi?: RecordOptions['abi'], deleteLabel = 'delete'): [string, string][] => {
  const firstAbiData = Array.isArray(abi) ? abi?.[0]?.encodedData : abi?.encodedData
  if (!firstAbiData) return []
  const decodedAbiData = hexToString(firstAbiData)
  if (decodedAbiData) return [['abi', decodedAbiData]]
  return [[deleteLabel, 'abi']]
}

export const recordOptionsToToupleList = (
  records?: RecordOptions,
  deleteLabel = 'delete',
): [string, string][] => {
  return [
    ...contentHashTouple(records?.contentHash, deleteLabel),
    ...abiTouple(records?.abi, deleteLabel),
    ...(records?.texts?.map(({ key, value }) => [key, value!]) || []),
    ...(records?.coins?.map(({ coin, value }) => [String(coin), shortenAddress(value!)]) || []),
  ].map(([key, value]) => (value ? [key, value] : [deleteLabel, key]))
}

const mergeRecords =
  <
    TMatchObject extends Record<string, any>,
    TMatchKey extends keyof TMatchObject = keyof TMatchObject,
  >(
    matchKey: TMatchKey,
  ) =>
  <TRecordItem extends TMatchObject>(
    a: TRecordItem[] = [],
    b: TRecordItem[] = [],
  ): TRecordItem[] => {
    return [...a, ...b].reduce<TRecordItem[]>((acc, record) => {
      const index = acc.findIndex((r) => r[matchKey] === record[matchKey])
      if (index === -1) return [...acc, record]
      acc[index] = { ...acc[index], ...record }
      return acc
    }, [])
  }

export const mergeTextRecords = mergeRecords<TextRecord>('key')

export const mergeAddressRecords = mergeRecords<AddressRecord>('id')

const checkRecordsEqual =
  <TMatchObject extends Record<string, any>>(keyFn: (item: TMatchObject) => string) =>
  (a: TMatchObject[] = [], b: TMatchObject[] = []): boolean => {
    return Object.values(
      [...a, ...b].reduce(
        (acc, item) => {
          const key = keyFn(item)
          if (acc[key]) acc[key] += 1
          else acc[key] = 1
          return acc
        },
        {} as Record<string, number>,
      ),
    ).every((count) => count === 2)
  }

const checkAddressRecordsEqual = checkRecordsEqual<AddressRecord>(
  (item) => `${item.id}-${item.value}`,
)
const checkTextRecordsEqual = checkRecordsEqual<TextRecord>((item) => `${item.key}-${item.value}`)

export const checkContentHashEqual = (
  a?: DecodedContentHash | string | null,
  b?: DecodedContentHash | string | null,
): boolean => {
  return contentHashToString(a) === contentHashToString(b)
}

export const checkAbiEqual = (abi?: Profile['abi'], abi2?: Profile['abi']): boolean => {
  if (!abi && !abi2) return true
  const abiStr = typeof abi === 'object' ? JSON.stringify(abi?.abi || {}) : abi
  const abiStr2 = typeof abi2 === 'object' ? JSON.stringify(abi2?.abi || {}) : abi2
  return abi?.contentType === abi2?.contentType && abiStr === abiStr2
}

export const checkProfileRecordsEqual = (a: Profile, b: Profile): boolean => {
  if (!checkTextRecordsEqual(a?.texts, b?.texts)) return false
  if (!checkAddressRecordsEqual(a?.coins, b?.coins)) return false
  if (!checkContentHashEqual(a?.contentHash, b?.contentHash)) return false
  if (!checkAbiEqual(a?.abi, b?.abi)) return false
  return true
}

export const makeEthRecordItem = (address: Address): AddressRecord => {
  return {
    id: 60,
    name: 'ETH',
    value: address,
  }
}

export const makeProfileRecordsWithEthRecordItem = (
  records: Profile = {},
  address?: Address,
): Profile => {
  return {
    ...records,
    coins: mergeAddressRecords(records?.coins, [...(address ? [makeEthRecordItem(address)] : [])]),
  }
}

export const profileRecordsToKeyValue = async (records: Profile): Promise<RecordOptions> => {
  const contentHash = contentHashToString(records?.contentHash)
  return {
    texts: records?.texts?.map(({ key, value }) => ({ key: key as string, value })),
    coins: records?.coins?.map((coinType) => ({
      coin: coinType.id,
      value: coinType.value,
    })),
    ...(contentHash ? { contentHash } : {}),
    ...(records.abi
      ? {
          abi: await encodeAbi({
            data: records.abi.abi as any,
            encodeAs: contentTypeToEncodeAs(records.abi.contentType as 1 | 2 | 4 | 8),
          }),
        }
      : {}),
  }
}

type ProfileMatchText = {
  type: 'text'
  match: TextRecord
}

type ProfileMatchAddress = {
  type: 'address'
  match: Omit<AddressRecord, 'name'>
}

export type RecordMatch = ProfileMatchText | ProfileMatchAddress

export const checkProfileRecordsContains = ({
  profile,
  type,
  match,
}: {
  profile: Profile
} & RecordMatch) => {
  if (type === 'text')
    return !!profile?.texts?.some(({ key, value }) => key === match.key && value === match.value)
  if (type === 'address')
    return !!profile?.coins?.some((coin) => coin.id === match.id && coin.value === match.value)
  return false
}

/* NOTE: These functions are used to add testnet support. */

const hasCoins = (
  records: unknown,
): records is GetRecordsReturnType<any, (string | number)[], any, any> => {
  return typeof records === 'object' && !!records && 'coins' in records
}

export const addTestnetRecords = (records: unknown) => {
  if (hasCoins(records)) {
    return {
      ...records,
      coins: records.coins.map((coin) => {
        return {
          ...coin,
          name: testnetNetworks.find(({ coinType }) => coinType === coin.id)?.name || coin.name,
        }
      }),
    }
  }
  return records
}

// coinNames are all lowercase except for legacy names which end with Legacy
export const normalizeCoinName = (coinName: string) => {
  if (/.+legacy$/i.test(coinName)) return `${coinName.replace(/legacy$/i, '').toLowerCase()}Legacy`
  return coinName.toLowerCase()
}

export const getCoderByCoinNameWithTestnetSupport = (_coinName: string) => {
  const coinName = normalizeCoinName(_coinName)
  const extendedCoin = testnetNetworks.find(({ name }) => name === coinName)
  if (extendedCoin) {
    const evmCoder = getCoderByCoinName('eth')
    return {
      ...evmCoder,
      name: extendedCoin.name,
      coinType: extendedCoin.coinType,
    }
  }
  return getCoderByCoinName(coinName)
}

export const getCoinTypeByCoinNameWithTestnetSupport = (coinName: string) => {
  return getCoderByCoinNameWithTestnetSupport(coinName).coinType
}

export const getCoderByCoinTypeWithTestnetSupport = (coinType: number) => {
  const extendedCoin = testnetNetworks.find(({ coinType: coinType2 }) => coinType === coinType2)
  if (extendedCoin) {
    return {
      ...getCoderByCoinType(60),
      name: extendedCoin.name,
      coinType: extendedCoin.coinType,
    }
  }
  return getCoderByCoinType(coinType)
}

export const recordsWithCointypeCoins = (records: RecordOptions): RecordOptions => {
  return {
    ...records,
    coins: records.coins?.map((coin) => {
      if (typeof coin.coin === 'string') {
        return {
          ...coin,
          coin: getCoinTypeByCoinNameWithTestnetSupport(coin.coin),
        }
      }
      return coin
    }),
  }
}
