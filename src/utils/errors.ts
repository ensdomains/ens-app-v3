import { BaseError, decodeErrorResult, RawContractError } from 'viem'

import { ethRegistrarControllerErrors, nameWrapperErrors } from '@ensdomains/ensjs/contracts'

export const getViemRevertErrorData = (err: unknown) => {
  if (!(err instanceof BaseError)) return undefined
  const error = err.walk() as RawContractError
  return typeof error.data === 'object' ? error.data.data : error.data
}

export const allContractErrors = [...ethRegistrarControllerErrors, ...nameWrapperErrors]

export const getReadableError = (err: unknown) => {
  const data = getViemRevertErrorData(err)
  if (!data) return null
  const decodedError = decodeErrorResult({
    abi: allContractErrors,
    data,
  })
  if (!decodedError) return null
  return decodedError.errorName
}
