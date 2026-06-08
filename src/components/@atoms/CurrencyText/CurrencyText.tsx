import { Skeleton } from '@ensdomains/thorin'

import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
  currency: CurrencyDisplay
}

export const makeCurrencyDisplay = ({
  eth,
  ethPrice,
  bufferPercentage = 100n,
  currency = 'eth',
}: Props & { ethPrice?: bigint }) => {
  if (eth === undefined) return '0.0000 ETH'
  if (currency === 'eth')
    return makeDisplay({ value: (eth * bufferPercentage) / 100n, symbol: 'eth' })
  if (ethPrice === undefined) return '0.0000 ETH'
  return makeDisplay({ value: (eth * ethPrice) / BigInt(1e8), symbol: currency })
}

export const CurrencyText = ({ eth, bufferPercentage = 100n, currency = 'eth' }: Props) => {
  const { data: ethPrice, isLoading: isEthPriceLoading } = useEthPrice()

  // `eth` of `0n` is a real value (free .testing), not a loading state. Only
  // gate on `undefined`. For fiat display we additionally need `ethPrice`; the
  // pure-ETH display does not, so skip the price-load gate when currency=eth.
  const isLoading =
    eth === undefined ||
    (currency !== 'eth' && (isEthPriceLoading || ethPrice === undefined))

  return (
    <Skeleton loading={isLoading}>
      {(() => {
        if (isLoading) return '0.0000 ETH'
        return makeCurrencyDisplay({ eth, ethPrice, bufferPercentage, currency })
      })()}
    </Skeleton>
  )
}
