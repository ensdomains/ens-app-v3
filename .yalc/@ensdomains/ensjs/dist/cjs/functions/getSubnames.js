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
var import_errors = require("../utils/errors");
var import_format = require("../utils/format");
var import_fuses = require("../utils/fuses");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
const largeQuery = async ({ gqlInstance, contracts }, {
  name,
  pageSize = 10,
  orderDirection,
  orderBy,
  lastSubnames = [],
  search = ""
}) => {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  const nameWrapperAddress = nameWrapper == null ? void 0 : nameWrapper.address.toLowerCase();
  const { client } = gqlInstance;
  const lastSubname = lastSubnames == null ? void 0 : lastSubnames[lastSubnames.length - 1];
  const lastCreatedAt = lastSubname == null ? void 0 : lastSubname.createdAt;
  const lastLabelName = lastSubname == null ? void 0 : lastSubname.labelName;
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
    id: (0, import_normalise.namehash)(name),
    first: pageSize,
    lastCreatedAt,
    lastLabelName,
    orderBy,
    orderDirection,
    search: search == null ? void 0 : search.toLowerCase()
  };
  const response = await client.request(finalQuery, queryVars).catch((e) => {
    throw new import_errors.ENSJSError({
      data: {
        subnames: [],
        subnameCount: 0
      },
      errors: (0, import_errors.getClientErrors)(e)
    });
  }).finally(import_errors.debugSubgraphLatency);
  const domain = (response == null ? void 0 : response.domain) || { subdomains: [], subdomainCount: 0 };
  const subdomains = domain.subdomains.map(
    ({ wrappedDomain, ...subname }) => {
      const decrypted = (0, import_labels.decryptName)(subname.name);
      const obj = {
        ...subname,
        labelName: subname.labelName || null,
        labelhash: subname.labelhash || "",
        name: decrypted,
        truncatedName: (0, import_format.truncateFormat)(decrypted),
        owner: subname.owner.id,
        type: "domain"
      };
      if (wrappedDomain && obj.owner === nameWrapperAddress) {
        obj.type = "wrappedDomain";
        const expiryDateAsDate = wrappedDomain.expiryDate && wrappedDomain.expiryDate !== "0" ? new Date(parseInt(wrappedDomain.expiryDate) * 1e3) : void 0;
        const hasExpired = expiryDateAsDate && expiryDateAsDate < new Date();
        obj.expiryDate = expiryDateAsDate;
        obj.fuses = (0, import_fuses.decodeFuses)(hasExpired ? 0 : wrappedDomain.fuses);
        obj.pccExpired = hasExpired ? (0, import_fuses.checkPCCBurned)(wrappedDomain.fuses) : false;
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
const getSubnames = (injected, functionArgs) => {
  return largeQuery(injected, functionArgs);
};
var getSubnames_default = getSubnames;
