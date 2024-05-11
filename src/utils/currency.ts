import { formatUnits } from 'viem'

export const makeDisplay = ({
  value,
  symbol,
  fromDecimals = 18,
}: {
  value: bigint | number
  symbol: string
  fromDecimals?: number
}) => {
  const number = typeof value === 'number' ? value : Number(formatUnits(value, fromDecimals))
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
    if (number < 0.00001) {
      options.maximumSignificantDigits = 1
    }
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
