import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

const MAX_DECIMALS = 15

export const somthing = () => {}

export const safelyMultiplyBigNumber = (bigNumber: BigNumber, multiplier: number, decimals = 2) => {
  if (multiplier >= Number.MAX_SAFE_INTEGER) throw new Error('Multiplier too large')
  const multiplierDigits = multiplier.toFixed(0).length
  const maxDecimals = MAX_DECIMALS - multiplierDigits
  const decimalsToUse = Math.max(Math.min(decimals, maxDecimals), 0)

  const bigNumberMultiplier = BigNumber.from(Math.floor(multiplier * 10 ** decimalsToUse))
  const bigNumberDivisor = BigNumber.from(10 ** decimalsToUse)
  return bigNumber.mul(bigNumberMultiplier).div(bigNumberDivisor)
}
