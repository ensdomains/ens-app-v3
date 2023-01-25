// src/functions/getSubnames.ts
import { truncateFormat } from "../utils/format.mjs";
import { decryptName } from "../utils/labels.mjs";
import { namehash } from "../utils/normalise.mjs";
var largeQuery = async ({ gqlInstance }, {
  name,
  pageSize = 10,
  orderDirection,
  orderBy,
  lastSubnames = [],
  search = ""
}) => {
  const { client } = gqlInstance;
  const lastSubname = lastSubnames?.[lastSubnames.length - 1];
  const lastCreatedAt = lastSubname?.createdAt;
  const lastLabelName = lastSubname?.labelName;
  let whereFilter = "";
  if (orderBy === "createdAt" && lastCreatedAt) {
    whereFilter += orderDirection === "asc" ? "createdAt_gt: $lastCreatedAt" : "createdAt_lt: $lastCreatedAt";
  } else if (orderBy === "labelName" && lastLabelName) {
    whereFilter += orderDirection === "asc" ? "labelName_gt: $lastLabelName" : "labelName_lt: $lastLabelName";
  }
  if (search) {
    whereFilter += " labelName_contains: $search";
  }
  const finalQuery = gqlInstance.gql`
    query getSubnames(
      $id: ID! 
      $first: Int
      $lastCreatedAt: BigInt
      $lastLabelName: String
      $orderBy: Domain_orderBy 
      $orderDirection: OrderDirection
      $search: String
    ) {
      domain(
        id: $id
      ) {
        subdomainCount
        subdomains(
          first: $first
          orderBy: $orderBy
          orderDirection: $orderDirection
          where: { 
            ${whereFilter}
          }
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
    lastCreatedAt,
    lastLabelName,
    orderBy,
    orderDirection,
    search: search?.toLowerCase()
  };
  const response = await client.request(finalQuery, queryVars);
  const domain = response?.domain;
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
  return largeQuery(injected, functionArgs);
};
var getSubnames_default = getSubnames;
export {
  getSubnames_default as default
};
