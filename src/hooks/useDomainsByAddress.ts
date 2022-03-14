import {
  GET_DOMAINS_SUBGRAPH,
  GET_REGISTRATIONS_SUBGRAPH,
} from "@app/graphql/queries";
import { usePaginate } from "./usePaginate";

export const useDomainsByAddress = ({
  resultsPerPage,
  domainType,
  address,
  sort,
  expiryDate,
}: {
  resultsPerPage: number;
  domainType: "registrant" | "controller";
  address: string;
  sort: {
    type: "expiryDate" | "labelName" | "registrationDate";
    direction: "asc" | "desc";
  };
  expiryDate: number;
}) => {
  const registrationsQuery = usePaginate(GET_REGISTRATIONS_SUBGRAPH, {
    pageSize: 10,
    targetKey: "account.registrations",
    variables: {
      id: address && address.toLowerCase(),
      orderBy: sort.type,
      orderDirection: sort.direction,
      expiryDate,
    },
    skip: domainType !== "registrant" || !sort.type || !sort.direction,
    fetchPolicy: "network-only",
  });

  const controllersQuery = usePaginate(GET_DOMAINS_SUBGRAPH, {
    pageSize: resultsPerPage,
    targetKey: "account.domains",
    variables: {
      id: address && address.toLowerCase(),
    },
    skip: domainType !== "controller",
    fetchPolicy: "network-only",
  });

  if (domainType === "registrant") {
    return registrationsQuery;
  }
  if (domainType === "controller") {
    return controllersQuery;
  }
  throw new Error("Unrecognised domainType");
};
