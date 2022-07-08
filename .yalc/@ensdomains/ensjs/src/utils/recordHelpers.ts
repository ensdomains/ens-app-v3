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

export const generateRecordCallArray = (
  namehash: string,
  records: RecordOptions,
  resolver: PublicResolver,
) => {
  const calls: string[] = []

  if (records.contentHash) {
    const contentHash =
      records.contentHash === '' ? '' : encodeContenthash(records.contentHash)
    const data = (resolver?.interface.encodeFunctionData as any)(
      'setContenthash',
      [namehash, contentHash],
    )
    data && calls.push(data)
  }

  if (records.texts && records.texts.length > 0) {
    records.texts.forEach(({ key, value }: RecordItem) => {
      const data = resolver?.interface.encodeFunctionData('setText', [
        namehash,
        key,
        value,
      ])
      data && calls.push(data)
    })
  }

  if (records.coinTypes && records.coinTypes.length > 0) {
    records.coinTypes.forEach(({ key, value }: RecordItem) => {
      const data = generateSetAddr(namehash, key, value, resolver!)
      data && calls.push(data)
    })
  }

  return calls
}
