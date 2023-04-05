import { useQuery } from 'wagmi'

import { tryBeautify } from '@app/utils/beautify'

const useBeautifiedName = (name: string): string => {
  const { data } = useQuery(['beautify', name], () => tryBeautify(name), {
    initialData: () => tryBeautify(name),
  })

  return data
}

export default useBeautifiedName
