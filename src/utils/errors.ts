import {
  BaseError,
  decodeErrorResult,
  EstimateGasExecutionError,
  formatEther,
  RawContractError,
  RpcRequestError,
  TransactionRejectedRpcError,
} from 'viem'

import { ethRegistrarControllerErrors, nameWrapperErrors } from '@ensdomains/ensjs/contracts'

type ReadableErrorType = 'insufficientFunds' | 'contract' | 'unknown'
type ReadableError = {
  message: string
  type: ReadableErrorType
}

export const getViemRevertErrorData = (err: unknown) => {
  if (!(err instanceof BaseError)) return undefined
  const error = err.walk() as RawContractError
  return typeof error.data === 'object' ? error.data.data : error.data
}

export const allContractErrors = [...ethRegistrarControllerErrors, ...nameWrapperErrors]

const insufficientFundsRegex =
  /insufficient funds for gas \* price \+ value: address (?<address>0x[a-fA-F0-9]{40}) have (?<availableBalance>\d*) want (?<requiredBalance>\d*)/

const getEstimateGasExecutionErrorMessage = (err: EstimateGasExecutionError) => {
  const originError = err.walk()
  const data = insufficientFundsRegex.exec(originError.message)
  if (data?.groups) {
    const { requiredBalance } = data.groups
    return {
      message: `Wallet balance too low. Minimum required balance: ${formatEther(
        BigInt(requiredBalance),
      )} ETH`,
      type: 'insufficientFunds',
    } as const
  }

  return null
}

const getTransactionRejectedRpcErrorMessage = (
  err: TransactionRejectedRpcError | RpcRequestError,
) => {
  if (err.details.toLowerCase().includes('insufficient funds'))
    return {
      message: 'Not enough ETH on Ethereum Mainnet',
      type: 'contract',
    } satisfies ReadableError

  return {
    message: err.details || err.shortMessage,
    type: 'contract',
  } satisfies ReadableError
}

export const getReadableError = (err: unknown): ReadableError | null => {
  if (err instanceof EstimateGasExecutionError) return getEstimateGasExecutionErrorMessage(err)
  if (err instanceof TransactionRejectedRpcError) return getTransactionRejectedRpcErrorMessage(err)
  if (err instanceof RpcRequestError) return getTransactionRejectedRpcErrorMessage(err)
  const data = getViemRevertErrorData(err)
  if (!data) return null
  const decodedError = decodeErrorResult({
    abi: allContractErrors,
    data,
  })
  if (!decodedError) return null
  return {
    message: decodedError.errorName,
    type: 'contract',
  } as const
}
