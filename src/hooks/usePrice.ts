import { useEns } from '@app/utils/EnsProvider'
import { useQuery } from '@tanstack/react-query'

export const usePrice = (nameOrNames: string | string[], duration: number, skip?: boolean) => {
  const { ready, getPrice } = useEns()
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  const {
    data: price,
    isLoading: loading,
    error,
  } = useQuery(['usePrice', duration, ...names], async () => getPrice(nameOrNames, duration), {
    enabled: !skip && ready,
  })

  return {
    price,
    loading,
    error,
  }
}
