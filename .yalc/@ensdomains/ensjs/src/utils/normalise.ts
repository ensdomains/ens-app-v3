import {
  DisallowedToken,
  EmojiToken,
  ens_beautify,
  ens_emoji,
  ens_normalize,
  ens_normalize_fragment,
  ens_split,
  ens_tokenize,
  IgnoredToken,
  is_combining_mark,
  Label,
  MappedToken,
  NFCToken,
  should_escape,
  StopToken,
  TextToken,
  Token,
  ValidToken,
} from '@adraffy/ens-normalize'
import { concat, hexlify } from '@ethersproject/bytes'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'
import { decodeLabelhash, isEncodedLabelhash } from './labels'

const zeros = new Uint8Array(32)
zeros.fill(0)

export const normalise = (name: string) => (name ? ens_normalize(name) : name)

export const namehash = (name: string): string => {
  let result: string | Uint8Array = zeros

  if (name) {
    const labels = name.split('.')

    for (let i = labels.length - 1; i >= 0; i -= 1) {
      let labelSha: string
      if (isEncodedLabelhash(labels[i])) {
        labelSha = decodeLabelhash(labels[i])
      } else {
        const normalised = normalise(labels[i])
        labelSha = keccak256(toUtf8Bytes(normalised))
      }

      result = keccak256(concat([result, labelSha]))
    }
  } else {
    result = hexlify(zeros)
  }

  return result as string
}

export const beautify = ens_beautify
export const emoji = ens_emoji
export const normalizeFragment = ens_normalize_fragment
export const split = ens_split
export const tokenise = ens_tokenize
export const isCombiningMark = is_combining_mark
export const shouldEscape = should_escape

export type {
  DisallowedToken,
  EmojiToken,
  IgnoredToken,
  Label,
  MappedToken,
  NFCToken,
  StopToken,
  TextToken,
  Token,
  ValidToken,
}
