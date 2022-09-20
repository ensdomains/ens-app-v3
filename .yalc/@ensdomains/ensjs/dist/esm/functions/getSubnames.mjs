// src/functions/getSubnames.ts
import { truncateFormat } from "../utils/format.mjs";
import { decryptName } from "../utils/labels.mjs";
import { namehash } from "../utils/normalise.mjs";
var largeQuery = async ({ gqlInstance }, { name, pageSize = 10, orderDirection, orderBy, lastSubnames = [] }) => {
  const { client } = gqlInstance;
  const finalQuery = gqlInstance.gql`
    query getSubnames(
      $id: ID! 
      $first: Int
      $lastCreatedAt: BigInt
      $orderBy: Domain_orderBy 
      $orderDirection: OrderDirection
    ) {
      domain(
        id: $id
      ) {
        subdomainCount
        subdomains(
          first: $first
          orderBy: $orderBy
          orderDirection: $orderDirection
          where: { createdAt_lt: $lastCreatedAt }
        ) {
          id
          labelName
          labelhash
          isMigrated
          name
          subdomainCount
          createdAt
          owner {
            id
          }
        }
      }
    }
  `;
  const queryVars = {
    id: namehash(name),
    first: pageSize,
    lastCreatedAt: lastSubnames[lastSubnames.length - 1]?.createdAt,
    orderBy,
    orderDirection
  };
  const { domain } = await client.request(finalQuery, queryVars);
  const subdomains = domain.subdomains.map((subname) => {
    const decrypted = decryptName(subname.name);
    return {
      ...subname,
      name: decrypted,
      truncatedName: truncateFormat(decrypted)
    };
  });
  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount
  };
};
var smallQuery = async ({ gqlInstance }, { name, page, pageSize = 10, orderDirection, orderBy }) => {
  const { client } = gqlInstance;
  const subdomainsGql = `
  id
  labelName
  labelhash
  isMigrated
  name
  subdomainCount
  createdAt
  owner {
    id
  }
`;
  let queryVars = {};
  let finalQuery = "";
  if (typeof page !== "number") {
    finalQuery = gqlInstance.gql`
    query getSubnames(
      $id: ID! 
      $orderBy: Domain_orderBy 
      $orderDirection: OrderDirection
    ) {
      domain(
        id: $id
      ) {
        subdomains(
          orderBy: $orderBy
          orderDirection: $orderDirection
        ) {
          ${subdomainsGql}
        }
      }
    }
  `;
    queryVars = {
      id: namehash(name),
      orderBy,
      orderDirection
    };
  } else {
    finalQuery = gqlInstance.gql`
    query getSubnames(
      $id: ID! 
      $first: Int
      $skip: Int
      $orderBy: Domain_orderBy 
      $orderDirection: OrderDirection
    ) {
      domain(
        id: $id
      ) {
        subdomainCount
        subdomains(
          first: $first
          skip: $skip
          orderBy: $orderBy
          orderDirection: $orderDirection
        ) {
          ${subdomainsGql}
        }
      }
    }
  `;
    queryVars = {
      id: namehash(name),
      first: pageSize,
      skip: (page || 0) * pageSize,
      orderBy,
      orderDirection
    };
  }
  const { domain } = await client.request(finalQuery, queryVars);
  const subdomains = domain.subdomains.map((subname) => {
    const decrypted = decryptName(subname.name);
    return {
      ...subname,
      name: decrypted,
      truncatedName: truncateFormat(decrypted)
    };
  });
  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount
  };
};
var getSubnames = (injected, functionArgs) => {
  if (functionArgs.isLargeQuery) {
    return largeQuery(injected, functionArgs);
  }
  return smallQuery(injected, functionArgs);
};
var getSubnames_default = getSubnames;
export {
  getSubnames_default as default
};
