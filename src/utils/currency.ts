import { BigNumber, FixedNumber } from 'ethers'

export const makeDisplay = (
  val: BigNumber,
  decimals: number,
  symbol: string,
  fromDecimals: number = 18,
) => {
  const [left, right] = FixedNumber.fromValue(val, fromDecimals)
    .round(decimals)
    .toString()
    .split('.')
  if (decimals === 0) {
    return `${left} ${symbol}`
  }
  const rightPadded = right.padEnd(decimals, '0')
  if (symbol === 'eth') {
    return `${left}.${rightPadded} ETH`
  }
  return `${symbol}${left}.${rightPadded}`
}
