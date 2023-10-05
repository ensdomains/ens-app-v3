import { useQuery } from 'wagmi'

import { tryBeautify } from '@app/utils/beautify'

import { useQueryKeyFactory } from './useQueryKeyFactory'

export const useBeautifiedName = (name: string): string => {
  const queryKey = useQueryKeyFactory({
    params: { name },
    functionName: 'getBeautifiedName',
    queryDependencyType: 'independent',
  })
  const { data } = useQuery(queryKey, ({ queryKey: [{ name: name_ }] }) => tryBeautify(name_), {
    initialData: () => tryBeautify(name),
  })

  return data
}
