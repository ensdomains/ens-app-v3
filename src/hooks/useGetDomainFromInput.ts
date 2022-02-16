import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { GET_SINGLE_NAME } from "@app/graphql/queries";
import { parseSearchTerm } from "@app/utils/utils";
import { validateName } from "@ensdomains/ui";
import { useEffect, useState } from "react";

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    isENSReady
  }
`;

export const useGetDomainFromInput = (input: string) => {
  const _name =
    input && (input.split(".").length === 1 ? `${input}.eth` : input);

  const [name, setNormalisedName] = useState("");
  const [valid, setValid] = useState<boolean | undefined>(undefined);
  const [type, setType] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  const [
    getDomain,
    { data: { singleName: domain } = { singleName: undefined } },
  ] = useLazyQuery(GET_SINGLE_NAME, {
    variables: { name },
    fetchPolicy: "no-cache",
    context: {
      queryDeduplication: false,
    },
  });

  const {
    data: { isENSReady },
  } = useQuery(NETWORK_INFORMATION_QUERY);

  useEffect(() => {
    let normalisedName;
    if (
      isENSReady &&
      typeof _name === "string" &&
      _name.length >= 3 &&
      !_name.split(".").some((label) => label.length === 0)
    ) {
      try {
        setLoading(true);
        // This is under the assumption that validateName never returns false
        normalisedName = validateName(_name);
        setNormalisedName(normalisedName);
      } finally {
        parseSearchTerm(normalisedName || _name)
          .then((_type: any) => {
            if (
              _type === "supported" ||
              _type === "tld" ||
              _type === "search"
            ) {
              setValid(true);

              setType(_type);
              getDomain().finally(() => setLoading(false));
            } else {
              if (_type === "invalid") {
                setType("domainMalformed");
              } else {
                setType(_type);
              }
              setValid(false);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error("Error parsing search:", err);
            setValid(false);
            setLoading(false);
          });
      }
    } else {
      setValid(false);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_name, isENSReady]);

  return { valid, type, domain, loading };
};
