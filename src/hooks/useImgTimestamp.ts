import { useQuery } from '@tanstack/react-query'

/**
 * Hook to get a stable timestamp for image cache busting.
 * The timestamp is cached indefinitely until manually invalidated
 * when a new image is uploaded.
 */
export const useImgTimestamp = () => {
  const query = useQuery({
    queryKey: ['image-timestamp'],
    queryFn: () => Date.now(),
    staleTime: Infinity,
    gcTime: Infinity, // Keep in cache forever (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
  return {
    ...query,
    addTimestamp: (url?: string | null) => {
      const isHttp = url?.startsWith('http')
      if (isHttp) return `${url}?timestamp=${query.data}`
      return url || undefined
    },
  }
}
