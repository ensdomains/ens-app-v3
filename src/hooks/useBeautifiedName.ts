import { QueryFunctionContext, queryOptions } from '@tanstack/react-query'

import { CreateQueryKey } from '@app/types'
import { tryBeautify } from '@app/utils/beautify'
import { useQuery } from '@app/utils/query/useQuery'

import { useQueryOptions } from './useQueryOptions'

type GetBeautifiedNameQueryKey = CreateQueryKey<
  { name: string },
  'getBeautifiedName',
  'independent'
>

const getBeautifiedNameQueryFn = ({
  queryKey: [{ name }],
}: QueryFunctionContext<GetBeautifiedNameQueryKey>) => {
  return tryBeautify(name)
}

export const useBeautifiedName = (name: string): string => {
  const initialOptions = useQueryOptions({
    params: { name },
    functionName: 'getBeautifiedName',
    queryDependencyType: 'independent',
    queryFn: getBeautifiedNameQueryFn,
  })
  const preparedOptions = queryOptions({
    queryKey: initialOptions.queryKey,
    queryFn: initialOptions.queryFn,
  })
  const { data } = useQuery({
    ...preparedOptions,
    initialData: () => tryBeautify(name),
  })

  return data ?? name // TODO: This shouldn't be necessary
}
