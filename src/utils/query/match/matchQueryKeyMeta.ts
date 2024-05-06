import { QueryKey } from '@tanstack/react-query'

import { CreateQueryKey, Prettify } from '@app/types'

import { BasicQueryKey, QueryKeyToInternalParams } from './queryKeyToInternalParams'

type ExtractMatchParameters<TInternalParams> = TInternalParams extends {
  functionParams: infer TFunctionParams
}
  ? keyof TFunctionParams
  : never

type MatchParametersToMatchedObject<
  TQueryKey extends BasicQueryKey,
  TInternalParams extends QueryKeyToInternalParams<TQueryKey>,
  TMatchParameters extends
    | Array<ExtractMatchParameters<TInternalParams>>
    | ReadonlyArray<ExtractMatchParameters<TInternalParams>>,
> = object & {
  [K in TMatchParameters[number]]: TInternalParams['functionParams'][K]
}

export const matchQueryKeyMeta = <
  TFunctionName extends string,
  TQueryKey extends BasicQueryKey,
  TInternalParams extends QueryKeyToInternalParams<TQueryKey>,
  const TMatchParameters extends
    | Array<ExtractMatchParameters<TInternalParams>>
    | ReadonlyArray<ExtractMatchParameters<TInternalParams>>,
>(
  {
    internalParams: { functionParams, chainId, address, scopeKey },
    matchFunctionName,
    matchParameters,
  }: {
    internalParams: TInternalParams
    matchFunctionName: TFunctionName
    matchParameters: TMatchParameters
  },
  matchKey: QueryKey,
): matchKey is CreateQueryKey<
  Prettify<MatchParametersToMatchedObject<TQueryKey, TInternalParams, TMatchParameters>>,
  TFunctionName,
  'standard'
> => {
  if (matchKey[4] !== matchFunctionName) return false
  if (matchKey[1] !== chainId) return false
  if (matchKey[2] !== address) return false
  if (matchKey[3] !== scopeKey) return false
  if (typeof matchKey[0] !== 'object' || !matchKey[0]) return false
  if (matchParameters.length > 0) {
    for (const matchParameter of matchParameters) {
      if (!(matchParameter in matchKey[0])) return false
      const ref = matchKey[0] as Record<typeof matchParameter, unknown>
      if (ref[matchParameter] !== functionParams[matchParameter]) return false
    }
  }
  return true
}
