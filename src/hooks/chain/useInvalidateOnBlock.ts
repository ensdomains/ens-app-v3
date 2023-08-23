import type { QueryKey } from '@tanstack/react-query'
import { useBlockNumber, useQueryClient } from 'wagmi'

export function useInvalidateOnBlock({
  enabled,
  queryKey,
}: {
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()
  useBlockNumber({
    watch: true,
    onBlock: enabled ? () => queryClient.invalidateQueries(queryKey) : undefined,
  })
}
