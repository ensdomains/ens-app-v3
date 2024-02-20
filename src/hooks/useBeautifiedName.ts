import { useQuery } from '@tanstack/react-query'

import { tryBeautify } from '@app/utils/beautify'

import { useQueryOptions } from './useQueryOptions'

export const useBeautifiedName = (name: string): string => {
  const { queryKey } = useQueryOptions({
    params: { name },
    functionName: 'getBeautifiedName',
    queryDependencyType: 'independent',
  })
  const { data } = useQuery(queryKey, ({ queryKey: [{ name: name_ }] }) => tryBeautify(name_), {
    initialData: () => tryBeautify(name),
  })

  return data
}
