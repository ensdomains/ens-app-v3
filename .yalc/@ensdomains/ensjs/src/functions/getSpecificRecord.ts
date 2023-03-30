import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import { BigNumber } from '@ethersproject/bignumber'
import { arrayify, hexStripZeros, isBytesLike } from '@ethersproject/bytes'
import { toUtf8String } from '@ethersproject/strings'
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
      (isBytesLike(decodedContent.decoded) &&
        hexStripZeros(decodedContent.decoded) === '0x') ||
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
    return response as string
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

    if (hexStripZeros(response) === '0x') {
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

// Supported content types as bitwise OR
// ID 1: JSON
// ID 2: zlib compressed JSON
// ID 4: CBOR
// ID 8: URI
const supportedContentTypes = '0xf'

export const _getABI = {
  raw: async ({ contracts }: ENSArgs<'contracts'>, name: string) => {
    const publicResolver = await contracts?.getPublicResolver()!
    return {
      to: '0x0000000000000000000000000000000000000000',
      data: publicResolver.interface.encodeFunctionData('ABI', [
        namehash(name),
        supportedContentTypes,
      ]),
    }
  },
  decode: async ({ contracts }: ENSArgs<'contracts'>, data: string) => {
    const publicResolver = await contracts?.getPublicResolver()!
    const [bnContentType, encodedABIData] =
      publicResolver.interface.decodeFunctionResult('ABI', data)
    if (!bnContentType || !data) {
      return
    }
    const contentType = (bnContentType as BigNumber).toNumber()
    if (!contentType) {
      return
    }
    let abiData: string | object
    let decoded = false
    switch (contentType) {
      // JSON
      case 1:
        abiData = JSON.parse(toUtf8String(encodedABIData))
        decoded = true
        break
      // zlib compressed JSON
      case 2: {
        const { inflate } = await import('pako/dist/pako_inflate.min.js')
        abiData = JSON.parse(
          inflate(arrayify(encodedABIData), { to: 'string' }),
        )
        decoded = true
        break
      }
      // CBOR
      case 4: {
        const { decodeFirst } = await import('cbor')
        abiData = await decodeFirst(arrayify(encodedABIData))
        decoded = true
        break
      }
      // URI
      case 8:
        abiData = toUtf8String(encodedABIData)
        decoded = false
        break
      default:
        try {
          abiData = toUtf8String(encodedABIData)
        } catch {
          abiData = encodedABIData
        }
        decoded = false
    }
    return {
      contentType,
      decoded,
      abi: abiData,
    }
  },
}

export const getABI = {
  raw: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    name: string,
  ) => {
    const prData = await _getABI.raw({ contracts }, name)
    return universalWrapper.raw(name, prData.data)
  },
  decode: async (
    { contracts, universalWrapper }: ENSArgs<'contracts' | 'universalWrapper'>,
    data: string,
  ) => {
    const urData = await universalWrapper.decode(data)
    if (!urData) return
    return _getABI.decode({ contracts }, urData.data)
  },
}
