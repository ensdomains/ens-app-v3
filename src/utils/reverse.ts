import {
  bytesToHex,
  labelhash as labelhashBytes32,
  namehash,
  stringToBytes,
  type Address,
  type ByteArray,
  type Hex,
} from 'viem'

import { evmChainIdToCoinType } from '@ensdomains/address-encoder/utils'

export type ReverseNodeOptions =
  | {
      ns?: string | number | bigint | undefined
    }
  | {
      chainId: number | bigint
    }
  | {
      coinType: number | bigint
    }

export const getReverseNamespace = (opts: ReverseNodeOptions) => {
  const base = '.reverse'
  if ('chainId' in opts) return `${evmChainIdToCoinType(Number(opts.chainId)).toString(16)}${base}`
  if ('coinType' in opts) return `${opts.coinType.toString(16)}${base}`
  return `${opts.ns ?? 'addr'}${base}`
}

export const getReverseNode = (address: Address, opts: ReverseNodeOptions = {}) =>
  `${address.toLowerCase().slice(2)}.${getReverseNamespace(opts)}` as const

export const getReverseNodeHash = (address: Address, opts: ReverseNodeOptions = {}) =>
  namehash(getReverseNode(address, opts))

export function encodeLabelhash(hash: string) {
  if (!hash.startsWith('0x')) throw new Error('Expected labelhash to start with 0x')

  if (hash.length !== 66) throw new Error('Expected labelhash to have a length of 66')

  return `[${hash.slice(2)}]`
}

export function packetToBytes(packet: string): ByteArray {
  // strip leading and trailing `.`
  const value = packet.replace(/^\./, '').replace(/\.$/, '')
  if (value.length === 0) return new Uint8Array(1)

  const bytes = new Uint8Array(stringToBytes(value).byteLength + 2)

  let offset = 0
  const list = value.split('.')
  for (let i = 0; i < list.length; i += 1) {
    let encoded = stringToBytes(list[i])
    if (encoded.byteLength > 255)
      encoded = stringToBytes(encodeLabelhash(labelhashBytes32(list[i])))
    bytes[offset] = encoded.length
    bytes.set(encoded, offset + 1)
    offset += encoded.length + 1
  }

  if (bytes.byteLength !== offset + 1) return bytes.slice(0, offset + 1)

  return bytes
}

export const dnsEncodeName = (name: string): Hex => bytesToHex(packetToBytes(name))
