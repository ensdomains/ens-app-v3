import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'
import { BigNumber } from 'ethers'

type Props = {
  eth?: BigNumber
  currency: CurrencyDisplay
}

export const CurrencyText = ({ eth, currency = 'eth' }: Props) => {
  const { data: ethPrice, loading } = useEthPrice()

  if (loading || !eth || !ethPrice) return null

  if (currency === 'eth') {
    return <>{makeDisplay(eth, 5, 'eth')}</>
  }
  return <>{makeDisplay(eth.mul(ethPrice), 2, currency)}</>
}
