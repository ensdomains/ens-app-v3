// src/functions/getSubnames.ts
import {
  ENSJSError,
  getClientErrors,
  debugSubgraphLatency
} from "../utils/errors.mjs";
import { truncateFormat } from "../utils/format.mjs";
import { checkPCCBurned, decodeFuses } from "../utils/fuses.mjs";
import { decryptName } from "../utils/labels.mjs";
import { namehash } from "../utils/normalise.mjs";
var largeQuery = async ({ gqlInstance, contracts }, {
  name,
  pageSize = 10,
  orderDirection,
  orderBy,
  lastSubnames = [],
  search = ""
}) => {
  const nameWrapper = await contracts?.getNameWrapper();
  const nameWrapperAddress = nameWrapper?.address.toLowerCase();
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
          wrappedDomain {
            fuses
            expiryDate
            owner {
              id
            }
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
  const response = await client.request(finalQuery, queryVars).catch((e) => {
    throw new ENSJSError({
      data: {
        subnames: [],
        subnameCount: 0
      },
      errors: getClientErrors(e)
    });
  }).finally(debugSubgraphLatency);
  const domain = response?.domain || { subdomains: [], subdomainCount: 0 };
  const subdomains = domain.subdomains.map(
    ({ wrappedDomain, ...subname }) => {
      const decrypted = decryptName(subname.name);
      const obj = {
        ...subname,
        labelName: subname.labelName || null,
        labelhash: subname.labelhash || "",
        name: decrypted,
        truncatedName: truncateFormat(decrypted),
        owner: subname.owner.id,
        type: "domain"
      };
      if (wrappedDomain && obj.owner === nameWrapperAddress) {
        obj.type = "wrappedDomain";
        const expiryDateAsDate = wrappedDomain.expiryDate && wrappedDomain.expiryDate !== "0" ? new Date(parseInt(wrappedDomain.expiryDate) * 1e3) : void 0;
        const hasExpired = expiryDateAsDate && expiryDateAsDate < new Date();
        obj.expiryDate = expiryDateAsDate;
        obj.fuses = decodeFuses(hasExpired ? 0 : wrappedDomain.fuses);
        obj.pccExpired = hasExpired ? checkPCCBurned(wrappedDomain.fuses) : false;
        obj.owner = obj.pccExpired ? void 0 : wrappedDomain.owner.id;
      }
      return obj;
    }
  );
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
