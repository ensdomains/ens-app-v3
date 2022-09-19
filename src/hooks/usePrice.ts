import { useQuery } from '@tanstack/react-query'

import { useEns } from '@app/utils/EnsProvider'

export const usePrice = (
  nameOrNames: string | string[],
  duration: number,
  legacy?: boolean,
  skip?: boolean,
) => {
  const { ready, getPrice } = useEns()
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]

  const type = legacy ? 'legacy' : 'new'
  console.log('usePrice', nameOrNames, names, duration)
  const {
    data: price,
    isLoading: loading,
    error,
  } = useQuery(
    ['usePrice', type, duration, ...names],
    async () => {
      try {
        console.log('getPrice', nameOrNames, duration)
        console.log('getPrice', getPrice)

        return await getPrice(nameOrNames, duration, legacy)
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: !skip && ready,
    },
  )

  console.log(error)

  return {
    price,
    loading,
    error,
  }
}
