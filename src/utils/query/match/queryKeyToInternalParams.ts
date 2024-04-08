export type BasicQueryKey =
  | readonly [object, unknown, unknown, unknown, unknown]
  | readonly [object, unknown, unknown, unknown, unknown, unknown]

export type QueryKeyToInternalParams<TQueryKey extends BasicQueryKey> = TQueryKey extends readonly [
  infer TFunctionParams,
  infer TChainId,
  infer TAddress,
  infer TScopeKey,
  infer TFunctionName,
  ...infer TRest,
]
  ? TFunctionParams extends object
    ? TRest[0] extends 'graph'
      ? {
          functionParams: TFunctionParams
          chainId: TChainId
          address: TAddress
          scopeKey: TScopeKey
          functionName: TFunctionName
          isGraphQuery: true
        }
      : {
          functionParams: TFunctionParams
          chainId: TChainId
          address: TAddress
          scopeKey: TScopeKey
          functionName: TFunctionName
        }
    : never
  : never

export const queryKeyToInternalParams = <const TQueryKey extends BasicQueryKey>([
  functionParams,
  chainId,
  address,
  scopeKey,
  functionName,
  graphKey,
]: TQueryKey) =>
  ({
    functionParams,
    chainId,
    address,
    scopeKey,
    functionName,
    ...(graphKey === 'graph' ? { isGraphQuery: true } : {}),
  }) as QueryKeyToInternalParams<TQueryKey>
