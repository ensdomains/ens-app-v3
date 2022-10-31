import { useCallback, useEffect, useState } from 'react'

export const useGetSegmentLength = () => {
  const [loading, setLoading] = useState(true)
  const { Segmenter } = window.Intl
  useEffect(() => {
    if (!Intl.Segmenter) {
      // Firefox Intl.Segmenter polyfill. Safely remove, when couple of minor release after the feature lands,
      // track the status here: https://bugzilla.mozilla.org/show_bug.cgi?id=1423593
      console.warn('Intl.Segmenter is not supported, loading polyfill')
      ;(async () => {
        const { createIntlSegmenterPolyfill } = await import('intl-segmenter-polyfill/dist/bundled')
        ;(Intl.Segmenter as typeof Intl['Segmenter']) = (await createIntlSegmenterPolyfill()) as any
        setLoading(false)
      })()
    } else {
      setLoading(false)
    }
  }, [])

  const getSegmentLength = useCallback(
    (name: string) => {
      if (Segmenter) return [...new Segmenter().segment(name)].length
      return 0
    },
    [Segmenter],
  )

  return { getSegmentLength, loading }
}
