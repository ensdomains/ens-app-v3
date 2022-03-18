import { useQuery } from '@apollo/client'
import {
  GET_ADDRESSES,
  GET_RESOLVER_FROM_SUBGRAPH,
  GET_TEXT_RECORDS,
} from '@app/graphql/queries'
import { getNamehash } from '@ensdomains/ui'
import { useEffect, useState } from 'react'

const loadFormats = async () => {
  const { formatsByCoinType } = await import('@ensdomains/address-encoder')
  return formatsByCoinType
}

export const useGetRecords = (domain = { name: undefined }) => {
  const [formatsByCoinType, setFormatsByCoinType] = useState<any>([])

  useEffect(() => {
    loadFormats().then((formats) => setFormatsByCoinType(formats))
  }, [])

  const { data: dataResolver, loading: resolverLoading } = useQuery(
    GET_RESOLVER_FROM_SUBGRAPH,
    {
      variables: {
        id: getNamehash(domain.name),
      },
    },
  )

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver

  const coinList =
    resolver &&
    resolver.coinTypes &&
    formatsByCoinType.length > 0 &&
    resolver.coinTypes
      .map((c: any) => {
        return formatsByCoinType[c] && formatsByCoinType[c].name
      })
      .filter((c: any) => c)

  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: { name: domain.name, keys: coinList },
      skip: !coinList,
      fetchPolicy: 'network-only',
    },
  )

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name,
        keys: resolver && resolver.texts,
      },
      skip: !dataResolver,
      fetchPolicy: 'network-only',
    },
  )

  return {
    dataAddresses,
    dataTextRecords,
    recordsLoading: addressesLoading || textRecordsLoading || resolverLoading,
  }
}
