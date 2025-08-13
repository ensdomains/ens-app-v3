import { useQueries } from '@tanstack/react-query'
import { Address } from 'viem'
import { useConfig } from 'wagmi'

import { getCoinTypeByCoinNameWithTestnetSupport } from '@app/utils/records'

import { getPrimaryNameQuery } from './queries/getPrimaryNameQuery'

export const usePrimaryNames = ({
  chainAddresses,
}: {
  chainAddresses: { name: string; value: Address }[]
}) => {
  const config = useConfig()
  return useQueries({
    queries: chainAddresses.map(({ name, value }) => ({
      queryKey: ['getPrimaryNames', name, value],
      queryFn: () =>
        getPrimaryNameQuery(config)({
          coinType: getCoinTypeByCoinNameWithTestnetSupport(name),
          address: value,
        }),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result?.data?.[0]),
        isLoading: results.some((result) => result?.isLoading || result?.isFetching),
        isError: results.some((result) => result?.isError),
      }
    },
  })
}
