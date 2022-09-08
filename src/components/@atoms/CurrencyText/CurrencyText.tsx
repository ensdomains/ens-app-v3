import { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'

import { useEthPrice } from '@app/hooks/useEthPrice'

type Props = {
  eth?: BigNumber
  currency: 'eth' | 'usd'
}

export const CurrencyText = ({ eth, currency = 'eth' }: Props) => {
  const { data: ethPrice, loading } = useEthPrice()

  if (loading || !eth || !ethPrice) return null
  return (
    <>
      {currency === 'eth'
        ? `${formatUnits(eth, 'ether').replace(/^(\d+\.\d{5})\d*/, '$1')} ETH`
        : `$${formatUnits(eth.mul(ethPrice), 'ether')
            .replace(/^(\d+\.\d{2})\d*/, '$1')
            .replace(/^(\d+\.\d)$/, '$10')}`}
    </>
  )
}
