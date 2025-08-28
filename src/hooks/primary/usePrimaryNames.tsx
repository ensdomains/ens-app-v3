import { useQueries } from '@tanstack/react-query'
import { Address, isAddress } from 'viem'
import { useConfig } from 'wagmi'

import { networks } from '@app/constants/networks'

import { getPrimaryNameQuery, GetPrimaryNameQueryReturnType } from './queries/getPrimaryNameQuery'

const filterForNetworks = ({ id, name, value }: { name: string; id?: number; value: string }) => {
  return networks.find(
    (network) => (network.coinType === id || network.name === name) && isAddress(value),
  )
}

const sortByNetwork = (a: GetPrimaryNameQueryReturnType, b: GetPrimaryNameQueryReturnType) => {
  if (!a || !b) return 0
  return (
    networks.findIndex((network) => network.coinType === a.coinType) -
    networks.findIndex((network) => network.coinType === b.coinType)
  )
}

export const usePrimaryNames = ({
  chainAddresses = [],
}: {
  chainAddresses?: { name: string; id?: number; value: string }[]
}) => {
  const config = useConfig()

  return useQueries({
    queries: chainAddresses.filter(filterForNetworks).map(({ id, name, value }) => ({
      queryKey: ['getPrimaryNames', name, value],
      queryFn: () =>
        getPrimaryNameQuery(config)({
          coinType: id,
          address: value as Address,
        }),
    })),
    combine: (results) => {
      return {
        data: results
          .map((result) => result?.data)
          .filter((result): result is NonNullable<GetPrimaryNameQueryReturnType> => !!result)
          .sort(sortByNetwork),
        isLoading: results.some((result) => result?.isLoading || result?.isFetching),
        isError: results.some((result) => result?.isError),
      }
    },
  })
}
