import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import {
  decodeFunctionData,
  encodeFunctionData,
  getAddress,
  Hash,
  Hex,
  toFunctionSelector,
} from 'viem'
import { getBlock, getTransactionReceipt, readContract } from 'viem/actions'

import {
  ethRegistrarControllerCommitmentsSnippet,
  ethRegistrarControllerCommitSnippet,
  getChainContractAddress,
  legacyEthRegistrarControllerCommitmentsSnippet,
  legacyEthRegistrarControllerCommitSnippet,
} from '@ensdomains/ensjs/contracts'

import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { ConfigWithEns, CreateQueryKey, QueryConfig } from '@app/types'
import { getIsCachedData } from '@app/utils/getIsCachedData'
import { prepareQueryOptions } from '@app/utils/prepareQueryOptions'

import { useInvalidateOnBlock } from '../chain/useInvalidateOnBlock'
import { useAddRecentTransaction } from '../transactions/useAddRecentTransaction'
import { useIsSafeApp } from '../useIsSafeApp'
import { useQueryOptions } from '../useQueryOptions'
import { getBlockMetadataByTimestamp } from './utils/getBlockMetadataByTimestamp'

type UseExistingCommitmentParameters = {
  commitment?: Hex
  commitKey?: string
  isLegacyCommit?: boolean
}

type UseExistingCommitmentInternalParameters = {
  setTransactionHashFromUpdate: (key: string, hash: Hash) => void
  addRecentTransaction: ReturnType<typeof useAddRecentTransaction>
  isSafeTx: boolean
}

type UseExistingCommitmentReturnType =
  | {
      status: 'transactionExists'
      timestamp: number
    }
  | {
      status: 'commitmentExists'
      timestamp: number
    }
  | {
      status: 'commitmentExpired'
      timestamp: number
    }
  | null

type UseExistingCommitmentConfig = QueryConfig<UseExistingCommitmentReturnType, Error>

type QueryKey<TParams extends UseExistingCommitmentParameters> = CreateQueryKey<
  TParams,
  'getExistingCommitment',
  'standard'
>

const maxCommitmentAgeSnippet = [
  {
    inputs: [],
    name: 'maxCommitmentAge',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const getCurrentBlockTimestampSnippet = [
  {
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const execTransactionSnippet = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      {
        internalType: 'enum Enum.Operation',
        name: 'operation',
        type: 'uint8',
      },
      { internalType: 'uint256', name: 'safeTxGas', type: 'uint256' },
      { internalType: 'uint256', name: 'baseGas', type: 'uint256' },
      { internalType: 'uint256', name: 'gasPrice', type: 'uint256' },
      { internalType: 'address', name: 'gasToken', type: 'address' },
      {
        internalType: 'address payable',
        name: 'refundReceiver',
        type: 'address',
      },
      { internalType: 'bytes', name: 'signatures', type: 'bytes' },
    ],
    name: 'execTransaction',
    outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

const getExistingWrappedCommitmentQueryFn =
  (config: ConfigWithEns) =>
  ({
    addRecentTransaction,
    setTransactionHashFromUpdate,
    isSafeTx,
  }: UseExistingCommitmentInternalParameters) =>
  async <TParams extends UseExistingCommitmentParameters>({
    queryKey: [{ commitment, commitKey }, chainId, address],
  }: QueryFunctionContext<QueryKey<TParams>>): Promise<UseExistingCommitmentReturnType> => {
    if (!commitment) throw new Error('commitment is required')
    if (!commitKey) throw new Error('commitKey is required')
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })
    const ethRegistrarControllerAddress = getChainContractAddress({
      client,
      contract: 'ensEthRegistrarController',
    })
    const multicall3Address = getChainContractAddress({
      client,
      contract: 'multicall3',
    })

    const [commitmentTimestamp, maxCommitmentAge, blockTimestamp] = await Promise.all([
      readContract(client, {
        abi: ethRegistrarControllerCommitmentsSnippet,
        address: ethRegistrarControllerAddress,
        functionName: 'commitments',
        args: [commitment],
      }),
      readContract(client, {
        abi: maxCommitmentAgeSnippet,
        address: ethRegistrarControllerAddress,
        functionName: 'maxCommitmentAge',
      }),
      readContract(client, {
        abi: getCurrentBlockTimestampSnippet,
        address: multicall3Address,
        functionName: 'getCurrentBlockTimestamp',
      }),
    ])
    if (!commitmentTimestamp || commitmentTimestamp === 0n) return null

    const commitmentAge = blockTimestamp - commitmentTimestamp
    const commitmentTimestampNumber = Number(commitmentTimestamp)
    const existsFailure = () =>
      ({ status: 'commitmentExists', timestamp: commitmentTimestampNumber }) as const

    if (commitmentAge > maxCommitmentAge)
      return { status: 'commitmentExpired', timestamp: commitmentTimestampNumber } as const

    const blockMetadata = await getBlockMetadataByTimestamp(client, {
      timestamp: commitmentTimestamp,
    })
    if (!blockMetadata.ok) return existsFailure()

    const blockData = await getBlock(client, {
      blockHash: blockMetadata.data.hash,
      includeTransactions: true,
    }).catch(() => null)
    if (!blockData) return existsFailure()

    const inputData = encodeFunctionData({
      abi: ethRegistrarControllerCommitSnippet,
      args: [commitment],
      functionName: 'commit',
    })

    const transaction = (() => {
      const checksummedAddress = getAddress(address)
      const checksummedEthRegistrarControllerAddress = getAddress(ethRegistrarControllerAddress)
      if (isSafeTx) {
        const execTransactionFunctionSelector = toFunctionSelector(execTransactionSnippet[0])
        const foundTransaction = blockData.transactions.find((t) => {
          // safe transaction gets sent to the safe contract itself
          if (!t.to || getAddress(t.to) !== checksummedAddress) return false
          if (!t.input.startsWith(execTransactionFunctionSelector)) return false
          const { args: safeTxData } = decodeFunctionData({
            abi: execTransactionSnippet,
            data: t.input,
          })
          if (getAddress(safeTxData[0]) !== checksummedEthRegistrarControllerAddress) return false
          if (getAddress(safeTxData[2]) !== inputData) return false
          return true
        })
        return foundTransaction
      }
      const foundTransaction = blockData.transactions.find((t) => {
        if (getAddress(t.from) !== checksummedAddress) return false
        if (!t.to || getAddress(t.to) !== checksummedEthRegistrarControllerAddress) return false
        if (t.input !== inputData) return false
        return true
      })
      return foundTransaction
    })()

    if (!transaction) return existsFailure()

    const transactionReceipt = await getTransactionReceipt(client, {
      hash: transaction.hash,
    })

    if (transactionReceipt.status !== 'success') return existsFailure()

    setTransactionHashFromUpdate(commitKey, transaction.hash)
    addRecentTransaction({
      ...transaction,
      hash: transaction.hash,
      action: 'commitName',
      key: commitKey,
      input: inputData,
      timestamp: commitmentTimestampNumber,
      isSafeTx,
      searchRetries: 0,
    })

    return {
      status: 'transactionExists',
      timestamp: commitmentTimestampNumber,
    } as const
  }

const getExistingLegacyCommitmentQueryFn =
  (config: ConfigWithEns) =>
  ({
    addRecentTransaction,
    setTransactionHashFromUpdate,
    isSafeTx,
  }: UseExistingCommitmentInternalParameters) =>
  async <TParams extends UseExistingCommitmentParameters>({
    queryKey: [{ commitment, commitKey }, chainId, address],
  }: QueryFunctionContext<QueryKey<TParams>>): Promise<UseExistingCommitmentReturnType> => {
    if (!commitment) throw new Error('commitment is required')
    if (!commitKey) throw new Error('commitKey is required')
    if (!address) throw new Error('address is required')

    const client = config.getClient({ chainId })
    const legacyEthRegistrarControllerAddress = getChainContractAddress({
      client,
      contract: 'legacyEthRegistrarController',
    })
    const multicall3Address = getChainContractAddress({
      client,
      contract: 'multicall3',
    })

    const [commitmentTimestamp, maxCommitmentAge, blockTimestamp] = await Promise.all([
      readContract(client, {
        abi: legacyEthRegistrarControllerCommitmentsSnippet,
        address: legacyEthRegistrarControllerAddress,
        functionName: 'commitments',
        args: [commitment],
      }),
      readContract(client, {
        abi: maxCommitmentAgeSnippet,
        address: legacyEthRegistrarControllerAddress,
        functionName: 'maxCommitmentAge',
      }),
      readContract(client, {
        abi: getCurrentBlockTimestampSnippet,
        address: multicall3Address,
        functionName: 'getCurrentBlockTimestamp',
      }),
    ])
    if (!commitmentTimestamp || commitmentTimestamp === 0n) return null

    const commitmentAge = blockTimestamp - commitmentTimestamp
    const commitmentTimestampNumber = Number(commitmentTimestamp)

    const existsFailure = () =>
      ({ status: 'commitmentExists', timestamp: commitmentTimestampNumber }) as const

    if (commitmentAge > maxCommitmentAge)
      return { status: 'commitmentExpired', timestamp: commitmentTimestampNumber } as const

    const blockMetadata = await getBlockMetadataByTimestamp(client, {
      timestamp: commitmentTimestamp,
    })
    if (!blockMetadata.ok) return existsFailure()

    const blockData = await getBlock(client, {
      blockHash: blockMetadata.data.hash,
      includeTransactions: true,
    }).catch(() => null)
    if (!blockData) return existsFailure()

    const inputData = encodeFunctionData({
      abi: legacyEthRegistrarControllerCommitSnippet,
      args: [commitment],
      functionName: 'commit',
    })

    const transaction = (() => {
      const checksummedAddress = getAddress(address)
      const checksummedEthRegistrarControllerAddress = getAddress(
        legacyEthRegistrarControllerAddress,
      )
      if (isSafeTx) {
        const execTransactionFunctionSelector = toFunctionSelector(execTransactionSnippet[0])
        const foundTransaction = blockData.transactions.find((t) => {
          // safe transaction gets sent to the safe contract itself
          if (!t.to || getAddress(t.to) !== checksummedAddress) return false
          if (!t.input.startsWith(execTransactionFunctionSelector)) return false
          const { args: safeTxData } = decodeFunctionData({
            abi: execTransactionSnippet,
            data: t.input,
          })
          if (getAddress(safeTxData[0]) !== checksummedEthRegistrarControllerAddress) return false
          if (getAddress(safeTxData[2]) !== inputData) return false
          return true
        })
        return foundTransaction
      }
      const foundTransaction = blockData.transactions.find((t) => {
        if (getAddress(t.from) !== checksummedAddress) return false
        if (!t.to || getAddress(t.to) !== checksummedEthRegistrarControllerAddress) return false
        if (t.input !== inputData) return false
        return true
      })
      return foundTransaction
    })()

    if (!transaction) return existsFailure()

    const transactionReceipt = await getTransactionReceipt(client, {
      hash: transaction.hash,
    })

    if (transactionReceipt.status !== 'success') return existsFailure()

    setTransactionHashFromUpdate(commitKey, transaction.hash)
    addRecentTransaction({
      ...transaction,
      hash: transaction.hash,
      action: 'commitName',
      key: commitKey,
      input: inputData,
      timestamp: commitmentTimestampNumber,
      isSafeTx,
      searchRetries: 0,
    })

    return {
      status: 'transactionExists',
      timestamp: commitmentTimestampNumber,
    } as const
  }

const getExistingCommitmentQueryFn =
  (config: ConfigWithEns) =>
  ({
    addRecentTransaction,
    setTransactionHashFromUpdate,
    isSafeTx,
  }: UseExistingCommitmentInternalParameters) =>
  async <TParams extends UseExistingCommitmentParameters>(
    context: QueryFunctionContext<QueryKey<TParams>>,
  ): Promise<UseExistingCommitmentReturnType> => {
    const {
      queryKey: [{ commitment, commitKey, isLegacyCommit }, , address],
    } = context
    if (!commitment) throw new Error('commitment is required')
    if (!commitKey) throw new Error('commitKey is required')
    if (!address) throw new Error('address is required')

    if (isLegacyCommit)
      return getExistingLegacyCommitmentQueryFn(config)({
        addRecentTransaction,
        setTransactionHashFromUpdate,
        isSafeTx,
      })(context)
    return getExistingWrappedCommitmentQueryFn(config)({
      addRecentTransaction,
      setTransactionHashFromUpdate,
      isSafeTx,
    })(context)
  }

export const useExistingCommitment = <TParams extends UseExistingCommitmentParameters>({
  // config
  enabled = true,
  gcTime,
  staleTime,
  scopeKey,
  // params
  ...params
}: TParams & UseExistingCommitmentConfig) => {
  const initialOptions = useQueryOptions({
    params,
    scopeKey,
    functionName: 'getExistingCommitment',
    queryDependencyType: 'standard',
    queryFn: getExistingCommitmentQueryFn,
  })

  const addRecentTransaction = useAddRecentTransaction()
  const { setTransactionHashFromUpdate } = useTransactionFlow()
  const { data: isSafeApp, isLoading: isSafeAppLoading } = useIsSafeApp()

  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ETH_NODE === 'anvil')
    console.log('commit is:', params.commitment)

  const preparedOptions = prepareQueryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn({
      addRecentTransaction,
      setTransactionHashFromUpdate,
      isSafeTx: !!isSafeApp,
    }),
    enabled: enabled && !!params.commitment && !isSafeAppLoading,
    gcTime,
    staleTime,
  })

  useInvalidateOnBlock({
    enabled: preparedOptions.enabled,
    queryKey: preparedOptions.queryKey,
  })

  const query = useQuery(preparedOptions)

  return {
    ...query,
    isCachedData: getIsCachedData(query),
  }
}
