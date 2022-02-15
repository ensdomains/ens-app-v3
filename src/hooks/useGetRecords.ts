import { useQuery } from "@apollo/client";
import {
  GET_ADDRESSES,
  GET_RESOLVER_FROM_SUBGRAPH,
  GET_TEXT_RECORDS,
} from "@app/graphql/queries";
import { formatsByCoinType } from "@ensdomains/address-encoder";
import { getNamehash } from "@ensdomains/ui";

export const useGetRecords = (domain = { name: undefined }) => {
  const { data: dataResolver } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name),
    },
  });

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver;

  const coinList =
    resolver &&
    resolver.coinTypes &&
    resolver.coinTypes
      .map((c: any) => {
        return formatsByCoinType[c] && formatsByCoinType[c].name;
      })
      .filter((c: any) => c);

  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: { name: domain.name, keys: coinList },
      skip: !coinList,
      fetchPolicy: "network-only",
    }
  );

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name,
        keys: resolver && resolver.texts,
      },
      skip: !dataResolver,
      fetchPolicy: "network-only",
    }
  );

  return {
    dataAddresses,
    dataTextRecords,
    recordsLoading: addressesLoading || textRecordsLoading,
  };
};
