import { useQuery } from 'wagmi'

import { tryBeautify } from '@app/utils/beautify'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

const useBeautifiedName = (name: string): string => {
  const { data } = useQuery(useQueryKeys().beautifiedName(name), () => tryBeautify(name), {
    initialData: () => tryBeautify(name),
  })

  return data
}

export default useBeautifiedName
