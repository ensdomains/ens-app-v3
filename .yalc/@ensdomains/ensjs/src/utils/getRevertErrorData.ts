import { BaseError, RawContractError } from 'viem'

export const getRevertErrorData = (err: unknown) => {
  if (!(err instanceof BaseError)) return undefined
  const error = err.walk() as RawContractError
  const hex = typeof error.data === 'object' ? error.data.data : error.data
  if (hex === '0x') return undefined
  return hex
}
