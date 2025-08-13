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

  console.log('networks', networks)
  console.log('chainAddresses', chainAddresses)

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
          .filter((result): result is GetPrimaryNameQueryReturnType => result !== undefined)
          .sort(sortByNetwork),
        isLoading: results.some((result) => result?.isLoading || result?.isFetching),
        isError: results.some((result) => result?.isError),
      }
    },
  })
}
