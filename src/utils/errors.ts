import {
  BaseError,
  decodeErrorResult,
  EstimateGasExecutionError,
  formatEther,
  RawContractError,
  RpcRequestError,
  TransactionRejectedRpcError,
} from 'viem'

import {
  dnsRegistrarErrors,
  ethRegistrarControllerErrors,
  nameWrapperErrors,
} from '@ensdomains/ensjs/contracts'

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

export const allContractErrors = [
  ...ethRegistrarControllerErrors,
  ...nameWrapperErrors,
  ...dnsRegistrarErrors,
]

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

/**
 * Attempts to decode a revert reason into one of the known ENS contract errors.
 *
 * `decodeErrorResult` throws (rather than returning a nullish value) when the
 * selector isn't present in the ABI, so the call must be guarded.
 */
export const decodeContractError = (err: unknown) => {
  const data = getViemRevertErrorData(err)
  if (!data) return null
  try {
    return decodeErrorResult({
      abi: allContractErrors,
      data,
    })
  } catch {
    return null
  }
}

/**
 * `CommitmentTooNew` means the block the call was executed against is still
 * older than `commitment + minCommitmentAge`. This is a transient condition:
 * the commitment simply hasn't aged into the chain's view of "now" yet, and the
 * call will succeed once the next block is mined.
 */
export const isCommitmentTooNewError = (err: unknown): boolean =>
  decodeContractError(err)?.errorName === 'CommitmentTooNew'

export const getReadableError = (err: unknown): ReadableError | null => {
  // Decode revert data first: an execution revert can reach us wrapped in any of
  // the error types below (e.g. `eth_createAccessList` surfaces one as an
  // `RpcRequestError`), and the decoded contract error is always more useful
  // than the generic viem message those branches fall back to.
  const decodedError = decodeContractError(err)
  if (decodedError)
    return {
      message: decodedError.errorName,
      type: 'contract',
    } as const

  if (err instanceof EstimateGasExecutionError) return getEstimateGasExecutionErrorMessage(err)
  if (err instanceof TransactionRejectedRpcError) return getTransactionRejectedRpcErrorMessage(err)
  if (err instanceof RpcRequestError) return getTransactionRejectedRpcErrorMessage(err)
  return null
}
