"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getSubnames_exports = {};
__export(getSubnames_exports, {
  default: () => getSubnames_default
});
module.exports = __toCommonJS(getSubnames_exports);
var import_format = require("../utils/format");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
const largeQuery = async ({ gqlInstance }, { name, pageSize = 10, orderDirection, orderBy, lastSubnames = [] }) => {
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
    id: (0, import_normalise.namehash)(name),
    first: pageSize,
    lastCreatedAt: lastSubnames[lastSubnames.length - 1]?.createdAt,
    orderBy,
    orderDirection
  };
  const { domain } = await client.request(finalQuery, queryVars);
  const subdomains = domain.subdomains.map((subname) => {
    const decrypted = (0, import_labels.decryptName)(subname.name);
    return {
      ...subname,
      name: decrypted,
      truncatedName: (0, import_format.truncateFormat)(decrypted)
    };
  });
  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount
  };
};
const smallQuery = async ({ gqlInstance }, { name, page, pageSize = 10, orderDirection, orderBy }) => {
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
      id: (0, import_normalise.namehash)(name),
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
      id: (0, import_normalise.namehash)(name),
      first: pageSize,
      skip: (page || 0) * pageSize,
      orderBy,
      orderDirection
    };
  }
  const { domain } = await client.request(finalQuery, queryVars);
  const subdomains = domain.subdomains.map((subname) => {
    const decrypted = (0, import_labels.decryptName)(subname.name);
    return {
      ...subname,
      name: decrypted,
      truncatedName: (0, import_format.truncateFormat)(decrypted)
    };
  });
  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount
  };
};
const getSubnames = (injected, functionArgs) => {
  if (functionArgs.isLargeQuery) {
    return largeQuery(injected, functionArgs);
  }
  return smallQuery(injected, functionArgs);
};
var getSubnames_default = getSubnames;
