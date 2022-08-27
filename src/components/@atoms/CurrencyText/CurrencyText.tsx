import { BigNumber } from 'ethers'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { formatUnits } from 'ethers/lib/utils'

type Props = {
  eth?: BigNumber
  currency: 'eth' | 'usd'
}

export const CurrencyText = ({ eth, currency = 'eth' }: Props) => {
  const { data: ethPrice, loading } = useEthPrice()

  if (loading || !eth || !ethPrice) return null
  return (
    <>{currency === 'eth' ? `${formatUnits(eth, 'ether')} ETH` : `$${formatUnits(eth, 'ether')}`}</>
  )
}
