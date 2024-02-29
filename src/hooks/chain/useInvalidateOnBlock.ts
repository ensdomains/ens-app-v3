import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useBlockNumber } from 'wagmi'

const shouldInvalidate = ({
  blockInterval,
  blockNumber,
  previousBlockNumber,
}: {
  blockInterval: bigint | undefined
  blockNumber: bigint | undefined
  previousBlockNumber: bigint | null
}) => {
  if (!blockNumber) return false
  if (blockNumber === previousBlockNumber) return false

  if (blockInterval) {
    // don't invalidate when blockInterval is provided and this is the first block number fetched, we want to invalidate at the end of the interval rather than the start
    if (!previousBlockNumber) return false
    const diff = blockNumber - previousBlockNumber
    return diff >= blockInterval
  }

  return true
}

export function useInvalidateOnBlock({
  blockInterval,
  enabled,
  queryKey,
}: {
  blockInterval?: bigint
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()

  const previousBlockNumberRef = useRef<bigint | null>(null)

  const { data: blockNumber } = useBlockNumber({
    watch: true,
    query: {
      enabled,
    },
  })

  useEffect(() => {
    if (
      shouldInvalidate({
        blockInterval,
        blockNumber,
        previousBlockNumber: previousBlockNumberRef.current,
      })
    )
      queryClient.invalidateQueries({ queryKey })
    if (blockNumber) previousBlockNumberRef.current = blockNumber
  }, [blockInterval, blockNumber, queryClient, queryKey])
}
