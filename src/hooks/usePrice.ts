import { useEns } from '@app/utils/EnsProvider'
import { yearsToSeconds } from '@app/utils/utils'
import { useQuery } from 'wagmi'

export const usePrice = (name: string) => {
  const { ready, getPrice } = useEns()
  const {
    data,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getPrice', name], () => getPrice(name, yearsToSeconds(1), false), {
    enabled: !!(ready && name),
  })

  const base = data?.base
  const premium = data?.premium
  const hasPremium = data?.premium.gt(0)

  return {
    base,
    premium,
    hasPremium,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
