import { QueryFunctionContext } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
  Address,
  BlockNumber,
  BlockTag,
  concatHex,
  formatEther,
  formatTransactionRequest,
  Hex,
  hexToBigInt,
  keccak256,
  padHex,
  parseEther,
  RpcTransactionRequest,
  toHex,
} from 'viem'
import { useConnectorClient } from 'wagmi'

import { useQueryOptions } from '@app/hooks/useQueryOptions'
import {
  createTransactionRequest,
  TransactionName,
  TransactionParameters,
} from '@app/transaction-flow/transaction'
import {
  ConfigWithEns,
  ConnectorClientWithEns,
  CreateQueryKey,
  Prettify,
  QueryConfig,
} from '@app/types'
import { DISCONNECTED_PLACEHOLDER_ADDRESS, emptyAddress } from '@app/utils/constants'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'
import { createAccessList } from '@app/utils/query/createAccessList'
import { useQuery } from '@app/utils/query/useQuery'

import { useGasPrice } from './useGasPrice'

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

export type TransactionItem = {
  [TName in TransactionName]: Omit<TransactionParameters<TName>, 'client' | 'connectorClient'> & {
    name: TName
    stateOverride?: UserStateOverrides
  }
}[TransactionName]

export type UseEstimateGasWithStateOverrideParameters<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[],
> = {
  transactions: TransactionItems
}

type GasEstimateArray<TransactionItems extends TransactionItem[] | readonly TransactionItem[]> =
  Prettify<{
    [n in keyof TransactionItems]: bigint
  }>

type UseEstimateGasWithStateOverrideReturnType<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[] = TransactionItem[],
> = {
  reduced: bigint
  gasEstimates: GasEstimateArray<TransactionItems>
}

type UseEstimateGasWithStateOverrideConfig = QueryConfig<
  UseEstimateGasWithStateOverrideReturnType,
  Error
>

type QueryKey<
  TransactionItems extends TransactionItem[] | readonly TransactionItem[],
  TParams extends UseEstimateGasWithStateOverrideParameters<TransactionItems>,
> = CreateQueryKey<TParams, 'estimateGasWithStateOverride', 'standard'>

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
      const storageKey = keys.reduce(concatKey, leftPadBytes32(toHex(slot)))
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
  connectorClient,
  client,
}: { name: TName; stateOverride?: UserStateOverrides } & TransactionParameters<TName>) => {
  const generatedRequest = await createTransactionRequest({
    client,
    connectorClient,
    data,
    name,
  })

  // SCAs use >21k gas to execute a transfer (most of the time, but depends on implementation)
  // For any SCA transaction involving a transfer, the transaction will probably fail by default due to the extra gas.
  // To fix this, we can use an access list of what storage slots are accessed in a transfer to pre-pay the cold gas,
  // then when the transfer is done, only warm gas is used and the transfer is under the limit.
  // Normally, you can just pull the estimated gas via `eth_getAccessList`, since it returns the access list + gas used,
  // but since we're using a state override and that method doesn't support it, we have to do it manually.
  // (Technically geth now has an implementation, but it's very new and only in geth, see https://github.com/ethereum/go-ethereum/issues/27630)
  //
  // To get the access list, we're executing the bytecode of this Yul code: https://gist.github.com/TateB/777287c9a63d5f02fcd905232ce5748a
  // (note: 0xed3869F3020315C839b2f4E9a73bEbE9a9670534 is replaced with `connectorClient.account.address`)
  // It does a simple transfer, and accesses any storage slot that would be accessed by any other transfer.
  const accessList = await createAccessList(client, {
    from: emptyAddress,
    data: concatHex(['0x5f808080600173', connectorClient.account.address, '0x5af100']),
    value: '0x1',
  })

  const formattedRequest = formatTransactionRequest({
    ...generatedRequest,
    from: connectorClient.account.address,
    accessList: accessList.accessList,
  })

  const stateOverrideWithBalance = stateOverride?.find(
    (s) => s.address === connectorClient.account.address,
  )
    ? stateOverride
    : [
        ...(stateOverride || []),
        {
          address: connectorClient.account.address,
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

  return client
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

export const estimateGasWithStateOverrideQueryFn =
  (config: ConfigWithEns) =>
  (connectorClient: ConnectorClientWithEns | undefined) =>
  async <
    TransactionItems extends TransactionItem[] | readonly TransactionItem[],
    TParams extends UseEstimateGasWithStateOverrideParameters<TransactionItems>,
  >({
    queryKey: [{ transactions }, chainId],
  }: QueryFunctionContext<QueryKey<TransactionItems, TParams>>) => {
    const client = config.getClient({ chainId })

    const connectorClientWithAccount = {
      ...(connectorClient ?? client),
      ...(connectorClient?.account?.address
        ? {}
        : {
            account: {
              address: DISCONNECTED_PLACEHOLDER_ADDRESS,
              type: 'json-rpc',
            },
          }),
    } as ConnectorClientWithEns

    const gasEstimates = await Promise.all(
      transactions.map((t) =>
        estimateIndividualGas({
          ...t,
          client,
          connectorClient: connectorClientWithAccount,
        }),
      ),
    )

    return {
      reduced: gasEstimates.reduce((acc, curr) => acc + curr, 0n),
      gasEstimates,
    }
  }

export const useEstimateGasWithStateOverride = <
  const TransactionItems extends TransactionItem[] | readonly TransactionItem[],
>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: UseEstimateGasWithStateOverrideParameters<TransactionItems> &
  UseEstimateGasWithStateOverrideConfig) => {
  const { data: connectorClient, isLoading: isConnectorLoading } =
    useConnectorClient<ConfigWithEns>()

  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'estimateGasWithStateOverride',
    queryDependencyType: 'standard',
    queryFn: estimateGasWithStateOverrideQueryFn,
  })

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn(connectorClient),
    enabled: enabled && !isConnectorLoading,
    gcTime,
    staleTime,
  })

  const query = useQuery(preparedOptions)

  const {
    data: gasPrice,
    isLoading: isGasPriceLoading,
    isFetching: isGasPriceFetching,
  } = useGasPrice()

  const data = useMemo(() => {
    if (!gasPrice || !query.data) {
      const transactions = params.transactions ?? []
      return {
        gasEstimate: 0n,
        gasEstimateArray: transactions.map(() => 0n) as GasEstimateArray<TransactionItems>,
        gasCost: 0n,
        gasCostEth: '0',
      }
    }

    const gasEstimate = query.data.reduced
    const gasEstimateArray = query.data.gasEstimates as GasEstimateArray<TransactionItems>
    const gasCost_ = gasPrice * gasEstimate

    return {
      gasEstimate,
      gasEstimateArray,
      gasCost: gasCost_,
      gasCostEth: formatEther(gasCost_),
    }
  }, [gasPrice, params.transactions, query.data])

  const isLoading = query.isLoading || isGasPriceLoading || isConnectorLoading
  const isFetching = query.isFetching || isGasPriceFetching

  return useMemo(
    () => ({
      ...query,
      data,
      gasPrice,
      isLoading,
      isFetching,
      refetchIfEnabled: preparedOptions.enabled ? query.refetch : () => {},
      isCachedData: getIsCachedData(query),
    }),
    [data, gasPrice, isFetching, isLoading, query, preparedOptions.enabled],
  )
}
