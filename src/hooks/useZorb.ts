import { useTheme } from 'styled-components'
import { useQuery } from 'wagmi'

import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { zorbImageDataURI } from '@app/utils/gradient'

export const useZorb = (input: string, type: 'address' | 'name' | 'hash') => {
  const {
    colors: { background: bg, text: fg, accentLight: accent },
  } = useTheme()
  const { data: zorb } = useQuery(
    useQueryKeys().globalIndependent.zorb(input, type, bg, fg, accent),
    () => zorbImageDataURI(input, type, { bg, fg, accent }),
  )
  return zorb
}
