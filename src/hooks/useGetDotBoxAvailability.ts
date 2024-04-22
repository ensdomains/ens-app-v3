import { useQuery } from '@tanstack/react-query'

const BOX_SEARCH_ENDPOINT = 'https://dotbox-worker.ens-cf.workers.dev/search'

export const useGetDotBoxAvailability = (name: string) => {
  const result = useQuery({
    queryKey: [name],
    queryFn: async () => {
      const response = await fetch(`${BOX_SEARCH_ENDPOINT}?domain=${name}`)
      return response.json()
    },
    staleTime: 10 * 1000,
    enabled: !!name && name?.endsWith('.box'),
  })

  return result
}
