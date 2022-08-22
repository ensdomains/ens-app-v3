import { QueryKey, useQueryClient } from '@tanstack/react-query'

import { useBlockNumber } from 'wagmi'

export function useInvalidateOnBlock({
  enabled,
  queryKey,
}: {
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()
  useBlockNumber({
    onBlock: enabled ? () => queryClient.invalidateQueries(queryKey) : undefined,
  })
}
