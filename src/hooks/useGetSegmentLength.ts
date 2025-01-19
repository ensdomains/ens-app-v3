import { useCallback } from 'react'

export const useGetSegmentLength = () => {
  const { Segmenter } = window.Intl

  const getSegmentLength = useCallback(
    (name: string) => {
      if (Segmenter) return [...new Segmenter().segment(name)].length
      return 0
    },
    [Segmenter],
  )

  return { getSegmentLength }
}
