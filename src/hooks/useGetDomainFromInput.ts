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

export const useGetDomainFromInput = (input: string, skip?: any) => {
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
    fetchPolicy: "cache-and-network",
    context: {
      queryDeduplication: false,
    },
  });

  const {
    data: { isENSReady },
  } = useQuery(NETWORK_INFORMATION_QUERY);

  useEffect(() => {
    let normalisedName;
    if (!skip) {
      try {
        setLoading(true);
        if (
          isENSReady &&
          typeof _name === "string" &&
          _name.length >= 3 &&
          !_name.split(".").some((label) => label.length === 0)
        ) {
          try {
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
                  getDomain();
                } else {
                  if (_type === "invalid") {
                    setType("domainMalformed");
                  } else {
                    setType(_type);
                  }
                  setValid(false);
                }
              })
              .catch((err) => {
                console.error("Error parsing search:", err);
                setValid(false);
              });
          }
        } else {
          setValid(false);
        }
      } finally {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_name, isENSReady]);

  return { valid, type, domain, loading };
};
