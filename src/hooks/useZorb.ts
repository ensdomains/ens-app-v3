import { useTheme } from 'styled-components'
import { useQuery } from '@tanstack/react-query'

import { zorbImageDataURI } from '@app/utils/gradient'

import { useQueryKeyFactory } from './useQueryKeyFactory'

export const useZorb = (input: string, type: 'address' | 'name' | 'hash') => {
  const {
    colors: { background: bg, text: fg, accentLight: accent },
  } = useTheme()
  const queryKey = useQueryKeyFactory({
    params: { input, type, colors: { bg, fg, accent } },
    functionName: 'zorb',
    queryDependencyType: 'independent',
  })
  const { data: zorb } = useQuery(queryKey, ({ queryKey: [params] }) =>
    zorbImageDataURI(params.input, params.type, params.colors),
  )
  return zorb
}
