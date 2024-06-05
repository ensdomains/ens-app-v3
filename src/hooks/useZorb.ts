import { useTheme } from 'styled-components'

import { zorbImageDataURI } from '@app/utils/gradient'
import { useQuery } from '@app/utils/query/useQuery'

import { useQueryOptions } from './useQueryOptions'

export const useZorb = (input: string, type: 'address' | 'name' | 'hash') => {
  const {
    colors: { background: bg, text: fg, accentLight: accent },
  } = useTheme()
  const { queryKey } = useQueryOptions({
    params: { input, type, colors: { bg, fg, accent } },
    functionName: 'zorb',
    queryDependencyType: 'independent',
    keyOnly: true,
  })
  const { data: zorb } = useQuery({
    queryKey,
    queryFn: ({ queryKey: [params] }) => zorbImageDataURI(params.input, params.type, params.colors),
  })
  return zorb
}
