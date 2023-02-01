import { formatFixed } from '@ethersproject/bignumber'
import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

export const makeDisplay = (
  val: BigNumber | number,
  decimals: number,
  symbol: string,
  fromDecimals: number = 18,
) => {
  const number = typeof val === 'number' ? val : Number(formatFixed(val, fromDecimals))
  const options: Intl.NumberFormatOptions & { [x: string]: string } = {
    style: 'currency',
    currency: symbol.toLowerCase(),
    useGrouping: 'auto' as any,
    trailingZeroDisplay: 'auto',
  }
  let customSymbol = ''
  if (symbol.toLowerCase() === 'gwei') {
    options.maximumSignificantDigits = 3
    options.maximumFractionDigits = 2
    options.style = 'decimal'
    options.roundingPriority = 'lessPrecision'
    options.currency = undefined
    customSymbol = ` ${symbol}`
  } else if (symbol === 'eth') {
    options.minimumFractionDigits = 4
    options.maximumFractionDigits = 4
    options.currencyDisplay = 'name'
  } else {
    options.maximumFractionDigits = 2
    options.minimumFractionDigits = 2
    options.currencyDisplay = symbol === 'usd' ? 'narrowSymbol' : 'symbol'
  }
  return new Intl.NumberFormat(undefined, options).format(number) + customSymbol
}
