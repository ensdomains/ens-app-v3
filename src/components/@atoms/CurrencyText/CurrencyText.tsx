import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

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
  return <>{makeDisplay(eth.mul(ethPrice).div(1e8), 2, currency, 18)}</>
}
