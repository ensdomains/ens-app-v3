import { match, P } from 'ts-pattern'

import { ClientWithEns } from '@ensdomains/ensjs/contracts'
import { GetAbiRecordReturnType } from '@ensdomains/ensjs/dist/types/functions/public/getAbiRecord'
import { getAbiRecord } from '@ensdomains/ensjs/public'
import { contentTypeToEncodeAs, generateSupportedContentTypes } from '@ensdomains/ensjs/utils'

import { Profile } from '@app/types'

const SupportedAbiEncodeAs = ['json', 'zlib', 'cbor', 'uri'] as const
const SupportedAbiContentTypes = [1, 2, 4, 8] as const

type AbiEncodeAs = (typeof SupportedAbiEncodeAs)[number]
type SupportedAbiContentType = (typeof SupportedAbiContentTypes)[number]

type GetUsedAbiContentTypesParameters = {
  name: string
}

type GetUsedAbiContentTypesResult = Promise<(typeof SupportedAbiEncodeAs)[number][]>

export const getUsedAbiEncodeAs = async (
  client: ClientWithEns,
  { name }: GetUsedAbiContentTypesParameters,
): GetUsedAbiContentTypesResult => {
  return Promise.allSettled(
    SupportedAbiEncodeAs.map(generateSupportedContentTypes).map((supportedContentTypes) => {
      return getAbiRecord(client, {
        name,
        supportedContentTypes,
      })
    }),
  )
    .then((results) => {
      return results
        .filter(
          (result): result is PromiseFulfilledResult<GetAbiRecordReturnType> =>
            result.status === 'fulfilled',
        )
        .map((result) =>
          result.value?.contentType &&
          SupportedAbiContentTypes.includes(result.value.contentType as SupportedAbiContentType)
            ? contentTypeToEncodeAs(result.value.contentType as SupportedAbiContentType)
            : null,
        )
        .filter((result): result is AbiEncodeAs => !!result)
    })
    .catch(() => [])
}

export const abiDisplayValue = (abi: Profile['abi']) =>
  match(abi)
    .with({ contentType: P.union(1, 2, 4), abi: {} }, ({ abi: abi_ }) => JSON.stringify(abi_))
    .with({ contentType: 8, abi: P.string }, ({ abi: abi_ }) => abi_)
    .otherwise(() => '')
