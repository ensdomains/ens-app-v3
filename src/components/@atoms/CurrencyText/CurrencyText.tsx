import { useEthPrice } from '../../../hooks/useEthPrice'

type Props = {
  eth?: number
  currency: 'eth' | 'usd'
  decimals?: number
}

export const CurrencyText = ({ eth = 0, currency = 'eth', decimals = 4 }: Props) => {
  const { data = 0, loading } = useEthPrice()
  if (loading) return null
  return <>{currency === 'eth' ? `${eth.toFixed(decimals)} ETH` : `$${(eth * data).toFixed(2)}`}</>
}
