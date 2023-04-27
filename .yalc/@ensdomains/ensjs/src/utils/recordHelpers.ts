import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import { isBytesLike } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'
import type { BigNumberish } from 'ethers'
import type { PublicResolver } from '../generated'
import { encodeContenthash } from './contentHash'

type RecordItem = {
  key: string
  value: string
}

type ABIEncodeAs = 'json' | 'zlib' | 'cbor' | 'uri'

type ABIItem = {
  contentType?: BigNumberish
  data: object | string
}

export type RecordOptions = {
  clearRecords?: boolean
  contentHash?: string
  texts?: RecordItem[]
  coinTypes?: RecordItem[]
  abi?: ABIItem
}

export const generateSetAddr = (
  namehash: string,
  coinType: string,
  address: string,
  resolver: PublicResolver,
) => {
  let coinTypeInstance
  if (!Number.isNaN(parseInt(coinType))) {
    coinTypeInstance = formatsByCoinType[parseInt(coinType)]
  } else {
    coinTypeInstance = formatsByName[coinType.toUpperCase()]
  }
  const inputCoinType = coinTypeInstance.coinType
  let encodedAddress = address !== '' ? coinTypeInstance.decoder(address) : '0x'
  if (inputCoinType === 60 && encodedAddress === '0x')
    encodedAddress = coinTypeInstance.decoder(
      '0x0000000000000000000000000000000000000000',
    )

  return resolver?.interface.encodeFunctionData(
    'setAddr(bytes32,uint256,bytes)',
    [namehash, inputCoinType, encodedAddress],
  )
}

export const generateABIInput = async (
  encodeAs: ABIEncodeAs,
  data: object | string,
) => {
  let contentType: number
  let encodedData: string | Buffer | Uint8Array
  switch (encodeAs) {
    case 'json':
      contentType = 1
      encodedData = JSON.stringify(data)
      break
    case 'zlib': {
      contentType = 2
      const { deflate } = await import('pako/dist/pako_deflate.min.js')
      encodedData = deflate(JSON.stringify(data))
      break
    }
    case 'cbor': {
      contentType = 4
      const { encode } = await import('cbor')
      encodedData = encode(data)
      break
    }
    default: {
      contentType = 8
      encodedData = data as string
      break
    }
  }
  return { contentType, data: encodedData }
}

export type RecordTypes = 'contentHash' | 'text' | 'addr' | 'abi'

export type RecordInput<T extends RecordTypes> = T extends 'contentHash'
  ? string
  : T extends 'abi'
  ? ABIItem
  : RecordItem

export function generateSingleRecordCall<T extends RecordTypes>(
  namehash: string,
  resolver: PublicResolver,
  type: T,
): (record: RecordInput<T>) => string {
  if (type === 'contentHash') {
    return (_r: RecordInput<T>) => {
      const record = _r as string
      let _contentHash = ''
      if (record !== _contentHash) {
        const encoded = encodeContenthash(record)
        if (encoded.error) throw new Error(encoded.error)
        _contentHash = encoded.encoded as string
      } else {
        _contentHash = '0x'
      }
      return resolver.interface.encodeFunctionData('setContenthash', [
        namehash,
        _contentHash,
      ])
    }
  }
  if (type === 'abi') {
    return (_r: RecordInput<T>) => {
      const record = _r as ABIItem
      const { contentType = 1, data } = record
      let encodedData = data as string | Uint8Array | Buffer
      if (!isBytesLike(encodedData)) {
        if (typeof encodedData === 'object') {
          encodedData = JSON.stringify(encodedData)
        }
        encodedData = toUtf8Bytes(encodedData)
      }
      return resolver.interface.encodeFunctionData('setABI', [
        namehash,
        contentType,
        encodedData,
      ])
    }
  }
  return (_r: RecordInput<T>) => {
    const record = _r as RecordItem
    if (type === 'text') {
      return resolver.interface.encodeFunctionData('setText', [
        namehash,
        record.key,
        record.value,
      ])
    }
    return generateSetAddr(namehash, record.key, record.value, resolver)
  }
}

export const generateRecordCallArray = (
  namehash: string,
  records: RecordOptions,
  resolver: PublicResolver,
) => {
  const calls: string[] = []

  if (records.clearRecords) {
    calls.push(
      resolver.interface.encodeFunctionData('clearRecords', [namehash]),
    )
  }

  if (typeof records.contentHash === 'string') {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      'contentHash',
    )(records.contentHash)
    if (data) calls.push(data)
  }

  if (records.abi) {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      'abi',
    )(records.abi)
    if (data) calls.push(data)
  }

  if (records.texts && records.texts.length > 0) {
    records.texts
      .map(generateSingleRecordCall(namehash, resolver, 'text'))
      .forEach((call) => calls.push(call))
  }

  if (records.coinTypes && records.coinTypes.length > 0) {
    records.coinTypes
      .map(generateSingleRecordCall(namehash, resolver, 'addr'))
      .forEach((call) => calls.push(call))
  }

  return calls
}
