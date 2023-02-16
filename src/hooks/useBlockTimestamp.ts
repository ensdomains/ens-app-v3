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
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60, // 1 minute
    },
  )
}
