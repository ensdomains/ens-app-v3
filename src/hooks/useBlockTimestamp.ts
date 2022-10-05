import { useProvider, useQuery } from 'wagmi'

export const useBlockTimestamp = () => {
  const provider = useProvider()
  return useQuery(
    ['use-block-timestamp'],
    async () => {
      const block = await provider.getBlock('latest')
      return block.timestamp * 1000
    },
    {
      enabled: !!provider,
      staleTime: 1000 * 60 * 60, // 1 hour
    },
  )
}
