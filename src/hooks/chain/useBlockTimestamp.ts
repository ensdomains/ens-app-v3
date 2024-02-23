import { useBlock } from 'wagmi'

type UseBlockTimestampParameters = {
  enabled?: boolean
}

export const useBlockTimestamp = ({ enabled = true }: UseBlockTimestampParameters = {}) => {
  return useBlock({
    blockTag: 'latest',
    query: {
      enabled,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5 /* 5 minutes */,
      staleTime: 1000 * 60 /* 1 minute */,
    },
  })
}
