import { decodeFunctionData, encodeFunctionData, getAddress, toFunctionSelector } from 'viem'
import { getBlock, readContract } from 'viem/actions'

import {
  ethRegistrarControllerCommitmentsSnippet,
  ethRegistrarControllerCommitSnippet,
  getChainContractAddress,
} from '@ensdomains/ensjs/contracts'
import { makeCommitment } from '@ensdomains/ensjs/utils'

import type { ClientWithEns } from '@app/types'
import { wagmiConfig } from '@app/utils/query/wagmi'

import { getTransactionKey } from '../key'
import type { StoredTransactionResult } from '../slices/createTransactionSlice'
import type { UseTransactionManager } from '../transactionManager'
import { createTransactionListener } from './createTransactionListener'
import { getBlockMetadataByTimestamp } from './utils/getBlockMetadataByTimestamp'

const commitSearchCache = new Map<string, Promise<void>>()

type SearchableCommitTransaction = Extract<
  StoredTransactionResult<'empty' | 'pending' | 'waitingForUser'>,
  { name: 'commitName' }
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

const attemptCommitSearch = async (
  client: ClientWithEns,
  storedTransaction: SearchableCommitTransaction,
) => {
  const { data: commitmentData, transactionType, account } = storedTransaction
  const commitment = makeCommitment(commitmentData)

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

  if (!commitmentTimestamp || commitmentTimestamp === 0n)
    return {
      status: 'notFound',
      currentHash: null,
      timestamp: 0,
    } as const

  const commitmentAge = blockTimestamp - commitmentTimestamp
  const commitmentTimestampNumber = Number(commitmentTimestamp)

  if (commitmentAge > maxCommitmentAge)
    return {
      status: 'commitmentExpired',
      currentHash: null,
      timestamp: commitmentTimestampNumber * 1000,
    } as const

  const existsEarlyEscape = () =>
    ({
      status: 'commitmentExists',
      currentHash: null,
      timestamp: commitmentTimestampNumber * 1000,
    }) as const

  const blockMetadata = await getBlockMetadataByTimestamp(client, {
    timestamp: commitmentTimestamp,
  })
  if (!blockMetadata.ok) return existsEarlyEscape()

  const blockData = await getBlock(client, {
    blockHash: blockMetadata.data.hash,
    includeTransactions: true,
  }).catch(() => null)
  if (!blockData) return existsEarlyEscape()

  const inputData = encodeFunctionData({
    abi: ethRegistrarControllerCommitSnippet,
    args: [commitment],
    functionName: 'commit',
  })

  const transaction = (() => {
    const checksummedAddress = getAddress(account)
    const checksummedEthRegistrarControllerAddress = getAddress(ethRegistrarControllerAddress)
    if (transactionType === 'safe') {
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

  if (!transaction) return existsEarlyEscape()

  return {
    status: 'commitmentFound',
    currentHash: transaction.hash,
    timestamp: commitmentTimestampNumber * 1000,
  } as const
}

const listenForExistingCommit = async (
  store: UseTransactionManager,
  transaction: SearchableCommitTransaction,
) => {
  const client = wagmiConfig.getClient({ chainId: transaction.targetChainId })

  const cleanup = () => {
    commitSearchCache.delete(getTransactionKey(transaction))
  }

  for (;;) {
    /* eslint-disable no-await-in-loop */
    const result = await attemptCommitSearch(client, transaction)
    const state = store.getState()
    // ensure transaction wasn't already found
    if (state.getTransaction(transaction)?.status === 'success') return cleanup()

    switch (result.status) {
      case 'commitmentFound':
        state.setTransactionHash(transaction, result.currentHash)
      // eslint-disable-next-line no-fallthrough
      case 'commitmentExpired':
      case 'commitmentExists':
        state.setTransactionStatus(transaction, 'success')
        state.setTransactionReceipt(transaction, { timestamp: result.timestamp })
        return cleanup()
      default:
        await new Promise((resolve) => {
          setTimeout(resolve, 10_000)
        })
        break
    }
    /* eslint-enable no-await-in-loop */
  }
}

export const existingCommitListener = (store: UseTransactionManager) =>
  createTransactionListener(
    (s) =>
      s
        .getTransactionsByStatus(['empty', 'pending', 'waitingForUser'])
        .filter((t): t is SearchableCommitTransaction => t.name === 'commitName'),
    (applicableTransactions) => {
      for (const tx of applicableTransactions) {
        const transactionKey = getTransactionKey(tx)
        const existingSearchPromise = commitSearchCache.get(transactionKey)
        // eslint-disable-next-line no-continue
        if (existingSearchPromise) continue

        const searchPromise = listenForExistingCommit(store, tx)
        commitSearchCache.set(transactionKey, searchPromise)
      }
    },
  )
