import {
  BaseError,
  decodeErrorResult,
  EstimateGasExecutionError,
  formatEther,
  parseAbi,
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

// SNRC: the SimplexController (deployed under the ETHRegistrarController key) adds
// custom errors that are not in ensjs's bundled ABIs. Without these, a register()
// revert (e.g. NftRequired, NameReserved, NameTooShort) can't be decoded and surfaces
// as "Execution reverted for an unknown reason".
const simplexControllerErrors = parseAbi([
  'error CommitmentNotFound(bytes32 commitment)',
  'error CommitmentTooNew(bytes32 commitment, uint256 minimumCommitmentTimestamp, uint256 currentTimestamp)',
  'error CommitmentTooOld(bytes32 commitment, uint256 maximumCommitmentTimestamp, uint256 currentTimestamp)',
  'error NameNotAvailable(string name)',
  'error DurationTooShort(uint256 duration)',
  'error ResolverRequiredWhenDataSupplied()',
  'error ResolverRequiredForReverseRecord()',
  'error UnexpiredCommitmentExists(bytes32 commitment)',
  'error InsufficientValue()',
  'error TransferFailed()',
  'error NameNotReserved(string name)',
  'error MaxCommitmentAgeTooLow()',
  'error MaxCommitmentAgeTooHigh()',
  'error NameTooShort(string name, uint8 minLength)',
  'error NameReserved(string name)',
  'error NftRequired()',
  'error MinCharLengthCanOnlyDecrease()',
  'error NftGateCanOnlyBeDisabled()',
  'error PriceOracleAlreadyFrozen()',
  'error ZeroAddress()',
  'error ReentrantCall()',
])

export const allContractErrors = [
  ...ethRegistrarControllerErrors,
  ...nameWrapperErrors,
  ...dnsRegistrarErrors,
  ...simplexControllerErrors,
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

export const getReadableError = (err: unknown): ReadableError | null => {
  if (err instanceof EstimateGasExecutionError) {
    // Insufficient-funds has its own message; any other estimate-time revert falls
    // through to the revert-data decode below so the real contract error surfaces
    // instead of viem's generic "Execution reverted for an unknown reason".
    const insufficientFunds = getEstimateGasExecutionErrorMessage(err)
    if (insufficientFunds) return insufficientFunds
  } else if (err instanceof TransactionRejectedRpcError || err instanceof RpcRequestError) {
    return getTransactionRejectedRpcErrorMessage(err)
  }
  const data = getViemRevertErrorData(err)
  if (!data) return null
  try {
    const decodedError = decodeErrorResult({ abi: allContractErrors, data })
    return {
      message: decodedError.errorName,
      type: 'contract',
    } as const
  } catch {
    // Unknown selector (error not in any bundled ABI): degrade gracefully. Without
    // this, decodeErrorResult throws AbiErrorSignatureNotFoundError, which on the
    // post-mining path swallowed the error entirely (no message rendered).
    return null
  }
}
