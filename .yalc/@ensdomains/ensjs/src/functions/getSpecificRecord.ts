import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { decodeContenthash } from '../utils/contentHash'
import { namehash } from '../utils/normalise'

export const _getContentHash = {
  raw: async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
    const publicResolver = await contracts?.getPublicResolver()!
    return {
      to: '0x0000000000000000000000000000000000000000',
      data: publicResolver.interface.encodeFunctionData('contenthash', [
        namehash(name),
      ]),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    let response: any
    const publicResolver = await contracts?.getPublicResolver()!
    try {
      ;[response] = publicResolver.interface.decodeFunctionResult(
        'contenthash',
        data,
      )
    } catch {
      return
    }

    if (!response) {
      return
    }

    const decodedContent = decodeContenthash(response)

    if (
      !decodedContent ||
      (ethers.utils.isBytesLike(decodedContent.decoded) &&
        ethers.utils.hexStripZeros(decodedContent.decoded) === '0x') ||
      Object.keys(decodedContent).length === 0
    ) {
      return
    }

    return decodedContent
  },
}

export const getContentHash = {
  raw: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    name: string,
  ) => {
    const prData = await _getContentHash.raw({ contracts }, name)
    return universalWrapper.raw(name, prData.data)
  },
  decode: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    data: string,
  ) => {
    const urData = await universalWrapper.decode(data)
    if (!urData) return
    return _getContentHash.decode({ contracts }, urData.data)
  },
}

export const _getText = {
  raw: async (
    { contracts }: ENSArgs<'contracts'>,
    name: string,
    key: string,
  ) => {
    const publicResolver = await contracts?.getPublicResolver()!
    return {
      to: '0x0000000000000000000000000000000000000000',
      data: publicResolver.interface.encodeFunctionData('text', [
        namehash(name),
        key,
      ]),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    const publicResolver = await contracts?.getPublicResolver()!
    const [response] = publicResolver.interface.decodeFunctionResult(
      'text',
      data,
    )
    if (!response) {
      return
    }
    return response
  },
}

export const getText = {
  raw: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    name: string,
    key: string,
  ) => {
    const prData = await _getText.raw({ contracts }, name, key)
    return universalWrapper.raw(name, prData.data)
  },
  decode: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    data: string,
  ) => {
    const urData = await universalWrapper.decode(data)
    if (!urData) return
    return _getText.decode({ contracts }, urData.data)
  },
}

export const _getAddr = {
  raw: async (
    { contracts }: ENSArgs<'contracts'>,
    name: string,
    coinType?: string | number,
    bypassFormat?: boolean,
  ) => {
    if (!coinType) {
      coinType = 60
    }

    const publicResolver = await contracts?.getPublicResolver()!

    if (coinType === 60 || coinType === '60') {
      return {
        to: '0x0000000000000000000000000000000000000000',
        data: publicResolver.interface.encodeFunctionData('addr(bytes32)', [
          namehash(name),
        ]),
      }
    }

    if (bypassFormat) {
      return {
        to: '0x0000000000000000000000000000000000000000',
        data: publicResolver.interface.encodeFunctionData(
          'addr(bytes32,uint256)',
          [namehash(name), coinType],
        ),
      }
    }
    const formatter =
      typeof coinType === 'string' && Number.isNaN(parseInt(coinType))
        ? formatsByName[coinType]
        : formatsByCoinType[
            typeof coinType === 'number' ? coinType : parseInt(coinType)
          ]

    if (!formatter) {
      throw new Error(`No formatter found for coin: ${coinType}`)
    }

    return {
      to: '0x0000000000000000000000000000000000000000',
      data: publicResolver.interface.encodeFunctionData(
        'addr(bytes32,uint256)',
        [namehash(name), formatter.coinType],
      ),
    }
  },
  decode: async (
    { contracts }: ENSArgs<'contracts'>,
    data: string,
    _name: string,
    coinType?: string | number,
  ) => {
    let returnCoinType = true
    if (!coinType) {
      coinType = 60
      returnCoinType = false
    }

    const publicResolver = await contracts?.getPublicResolver()!
    const formatter =
      typeof coinType === 'string' && Number.isNaN(parseInt(coinType))
        ? formatsByName[coinType]
        : formatsByCoinType[
            typeof coinType === 'number' ? coinType : parseInt(coinType)
          ]

    let response: string

    if (coinType === 60 || coinType === '60') {
      ;[response] = publicResolver.interface.decodeFunctionResult(
        'addr(bytes32)',
        data,
      )
    } else {
      ;[response] = publicResolver.interface.decodeFunctionResult(
        'addr(bytes32,uint256)',
        data,
      )
    }

    if (!response) return

    if (ethers.utils.hexStripZeros(response) === '0x') {
      return
    }

    const decodedAddr = formatter.encoder(Buffer.from(response.slice(2), 'hex'))

    if (!decodedAddr) {
      return
    }

    if (!returnCoinType) {
      return decodedAddr
    }

    return { coin: formatter.name, addr: decodedAddr }
  },
}

export const getAddr = {
  raw: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    name: string,
    coinType?: string | number,
  ) => {
    const prData = await _getAddr.raw({ contracts }, name, coinType)
    return universalWrapper.raw(name, prData.data)
  },
  decode: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    data: string,
    _name: string,
    coinType?: string | number,
  ) => {
    const urData = await universalWrapper.decode(data)
    if (!urData) return
    return _getAddr.decode({ contracts }, urData.data, _name, coinType)
  },
}
