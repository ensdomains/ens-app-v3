import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import type { PublicResolver } from '../generated'
import { encodeContenthash } from './contentHash'

type RecordItem = {
  key: string
  value: string
}

export type RecordOptions = {
  contentHash?: string
  texts?: RecordItem[]
  coinTypes?: RecordItem[]
}

export const generateSetAddr = (
  namehash: string,
  coinType: string,
  address: string,
  resolver: PublicResolver,
) => {
  let coinTypeInstance
  if (!isNaN(parseInt(coinType))) {
    coinTypeInstance = formatsByCoinType[parseInt(coinType)]
  } else {
    coinTypeInstance = formatsByName[coinType.toUpperCase()]
  }
  const inputCoinType = coinTypeInstance.coinType
  const encodedAddress = coinTypeInstance.decoder(address)
  return resolver?.interface.encodeFunctionData(
    'setAddr(bytes32,uint256,bytes)',
    [namehash, inputCoinType, encodedAddress],
  )
}

export type RecordTypes = 'contentHash' | 'text' | 'addr'

export type RecordInput<T extends RecordTypes> = T extends 'contentHash'
  ? string
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
      }
      return resolver.interface.encodeFunctionData('setContenthash', [
        namehash,
        _contentHash,
      ])
    }
  } else {
    return (_r: RecordInput<T>) => {
      const record = _r as RecordItem
      if (type === 'text') {
        return resolver.interface.encodeFunctionData('setText', [
          namehash,
          record.key,
          record.value,
        ])
      } else {
        return generateSetAddr(namehash, record.key, record.value, resolver)
      }
    }
  }
}

export const generateRecordCallArray = (
  namehash: string,
  records: RecordOptions,
  resolver: PublicResolver,
) => {
  const calls: string[] = []

  if (records.contentHash) {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      'contentHash',
    )(records.contentHash)
    data && calls.push(data)
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
