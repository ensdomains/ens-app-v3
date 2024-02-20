import { QueryFunctionContext } from '@tanstack/react-query'
import { getPublicClient } from '@wagmi/core'
import { useMemo } from 'react'
import {
  Address,
  BlockNumber,
  BlockTag,
  concatHex,
  formatTransactionRequest,
  Hex,
  hexToBigInt,
  keccak256,
  padHex,
  parseEther,
  RpcTransactionRequest,
  toHex,
  TransactionRequest,
  WalletClient,
} from 'viem'
import { useQuery } from 'wagmi'

import { useQueryKeyFactory } from '@app/hooks/useQueryKeyFactory'
import {
  createTransactionRequest,
  TransactionName,
  TransactionParameters,
} from '@app/transaction-flow/transaction'
import {
  CreateQueryKey,
  Prettify,
  PublicClientWithChain,
  QueryConfig,
  WalletClientWithAccount,
} from '@app/types'

import { useWalletClientWithAccount } from '../account/useWalletClient'

type UserStateValue = {
  slot: number
  keys: Hex[]
  value: Hex | boolean | bigint
}

type UserStateOverrides = {
  address: Address
  /* Fake balance to set for the account before executing the call */
  balance?: bigint
  /* Fake nonce to set for the account before executing the call */
  nonce?: number
  /* Fake EVM bytecode to inject into the account before executing the call */
  code?: Hex
  /* Fake key-value mapping to override **all** slots in the account storage before executing the call */
  state?: UserStateValue[]
  /* Fake key-value mapping to override **individual** slots in the account storage before executing the call */
  stateDiff?: UserStateValue[]
}[]

type StateOverride<Quantity256 = bigint, Quantity = number> = {
  [address: Address]: {
    /* Fake balance to set for the account before executing the call */
    balance?: Quantity256
    /* Fake nonce to set for the account before executing the call */
    nonce?: Quantity
    /* Fake EVM bytecode to inject into the account before executing the call */
    code?: Hex
    /* Fake key-value mapping to override **all** slots in the account storage before executing the call */
    state?: {
      [slot: Hex]: Hex
    }
    /* Fake key-value mapping to override **individual** slots in the account storage before executing the call */
    stateDiff?: {
      [slot: Hex]: Hex
    }
  }
}

type TransactionItem = {
  [TName in TransactionName]: Omit<
    TransactionParameters<TName>,
    'publicClient' | 'walletClient'
  > & { name: TName; stateOverride?: UserStateOverrides }
}[TransactionName]

type UseTransactionGasEstimatesParameters<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[],
> = {
  transactions: TransactionItems
}

type GasEstimateArray<TransactionItems extends TransactionItem[] | readonly TransactionItem[]> =
  Prettify<{
    [n in keyof TransactionItems]: bigint
  }>

type UseTransactionGasEstimatesReturnType<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[] = TransactionItem[],
> = {
  reduced: bigint
  gasEstimates: GasEstimateArray<TransactionItems>
}

type UseTransactionGasEstimatesConfig<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[],
> = QueryConfig<UseTransactionGasEstimatesReturnType<TransactionItems>, Error>

type QueryKey<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[],
  TParams extends UseTransactionGasEstimatesParameters<TransactionItems>,
> = CreateQueryKey<TParams, 'getTransactionGasEstimates', 'standard'>

const leftPadBytes32 = (hex: Hex) => padHex(hex, { dir: 'left', size: 32 })

const concatKey = (existing: Hex, key: Hex) => keccak256(concatHex([leftPadBytes32(key), existing]))
const calculateStorageValue = (value: UserStateValue['value']) => {
  if (typeof value === 'boolean') {
    return value ? leftPadBytes32('0x01') : leftPadBytes32('0x00')
  }

  if (typeof value === 'bigint') {
    return leftPadBytes32(toHex(value))
  }

  return leftPadBytes32(value)
}

const mapUserState = (state: UserStateValue[]) =>
  Object.fromEntries(
    state.map(({ slot, keys, value }) => {
      const storageKey = keys.reverse().reduce(concatKey, leftPadBytes32(toHex(slot)))
      const storageValue = calculateStorageValue(value)
      return [storageKey, storageValue]
    }),
  )

export const addStateOverride = <
  const TTransactionItem extends TransactionItem | Readonly<TransactionItem>,
  const TStateOverride extends UserStateOverrides,
>({
  item,
  stateOverride,
}: {
  item: TTransactionItem
  stateOverride: TStateOverride
}) =>
  ({
    ...item,
    stateOverride,
  }) as Prettify<TTransactionItem & { stateOverride: TStateOverride }>

const estimateIndividualGas = async <TName extends TransactionName>({
  data,
  name,
  stateOverride,
  walletClient,
  publicClient,
}: { name: TName; stateOverride?: UserStateOverrides } & TransactionParameters<TName>) => {
  const generatedRequest = await createTransactionRequest({
    publicClient,
    walletClient,
    data,
    name,
  })

  const formattedRequest = formatTransactionRequest({
    ...generatedRequest,
    from: walletClient.account.address,
  } as TransactionRequest)

  const stateOverrideWithBalance = stateOverride?.find(
    (s) => s.address === walletClient.account.address,
  )
    ? stateOverride
    : [
        ...(stateOverride || []),
        {
          address: walletClient.account.address,
          balance:
            ('value' in generatedRequest && generatedRequest.value ? generatedRequest.value : 0n) +
            parseEther('10'),
        },
      ]

  const formattedOverrides = Object.fromEntries(
    (stateOverrideWithBalance || []).map(({ address, balance, nonce, code, state, stateDiff }) => [
      address,
      {
        ...(state ? { state: mapUserState(state) } : {}),
        ...(stateDiff ? { stateDiff: mapUserState(stateDiff) } : {}),
        ...(code ? { code } : {}),
        ...(balance ? { balance: toHex(balance) } : {}),
        ...(nonce ? { nonce: toHex(nonce) } : {}),
      },
    ]),
  )

  return publicClient
    .request<{
      Method: 'eth_estimateGas'
      Parameters:
        | [transaction: RpcTransactionRequest]
        | [transaction: RpcTransactionRequest, block: BlockNumber | BlockTag]
        | [
            transaction: RpcTransactionRequest,
            block: BlockNumber | BlockTag,
            overrides: StateOverride<Hex, Hex>,
          ]
      ReturnType: Hex
    }>({
      method: 'eth_estimateGas',
      params: [formattedRequest, 'latest', formattedOverrides],
    })
    .then((g) => hexToBigInt(g))
}

export const transactionGasEstimatesQueryFn =
  (walletClient: WalletClient | undefined) =>
  async <
    TransactionItems extends TransactionItem[] | readonly TransactionItem[],
    TParams extends UseTransactionGasEstimatesParameters<TransactionItems>,
  >({
    queryKey: [{ transactions }, chainId],
  }: QueryFunctionContext<QueryKey<TransactionItems, TParams>>) => {
    const publicClient = getPublicClient<PublicClientWithChain>({ chainId })

    const walletClientWithAccount = {
      ...(walletClient ?? publicClient),
      ...(walletClient?.account?.address
        ? {}
        : {
            account: {
              address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              type: 'json-rpc',
            },
          }),
    } as WalletClientWithAccount

    const gasEstimates = await Promise.all(
      transactions.map((t) =>
        estimateIndividualGas({
          ...t,
          publicClient,
          walletClient: walletClientWithAccount,
        }),
      ),
    )

    return {
      reduced: gasEstimates.reduce((acc, curr) => acc + curr, 0n),
      gasEstimates: gasEstimates as GasEstimateArray<TransactionItems>,
    }
  }

export const useTransactionGasEstimates = <
  const TransactionItems extends TransactionItem[] | readonly TransactionItem[],
>({
  // config
  cacheTime = 60,
  enabled = true,
  staleTime,
  scopeKey,
  onError,
  onSettled,
  onSuccess,
  // params
  ...params
}: UseTransactionGasEstimatesParameters<TransactionItems> &
  UseTransactionGasEstimatesConfig<TransactionItems>) => {
  const { data: walletClient, isLoading: isWalletClientLoading } = useWalletClientWithAccount()

  const queryKey = useQueryKeyFactory({
    params,
    scopeKey,
    functionName: 'getTransactionGasEstimates',
    queryDependencyType: 'standard',
  })

  const query = useQuery(queryKey, transactionGasEstimatesQueryFn(walletClient), {
    cacheTime,
    enabled: enabled && !isWalletClientLoading,
    staleTime,
    onError,
    onSettled,
    onSuccess,
    select: (r) => ({
      reduced: BigInt(r.reduced),
      gasEstimates: r.gasEstimates.map((g) => BigInt(g)) as GasEstimateArray<TransactionItems>,
    }),
  })

  const isLoading = query.isLoading || isWalletClientLoading

  return useMemo(
    () => ({
      ...query,
      isLoading,
      isCachedData: query.status === 'success' && query.isFetched && !query.isFetchedAfterMount,
    }),
    [isLoading, query],
  )
}
