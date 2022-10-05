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
var getNames_exports = {};
__export(getNames_exports, {
  default: () => getNames_default
});
module.exports = __toCommonJS(getNames_exports);
var import_format = require("../utils/format");
var import_labels = require("../utils/labels");
const mapDomain = (domain) => {
  const decrypted = (0, import_labels.decryptName)(domain.name);
  return {
    ...domain,
    name: decrypted,
    truncatedName: (0, import_format.truncateFormat)(decrypted),
    createdAt: new Date(parseInt(domain.createdAt) * 1e3),
    type: "domain"
  };
};
const mapRegistration = (registration) => {
  const decrypted = (0, import_labels.decryptName)(registration.domain.name);
  return {
    expiryDate: new Date(parseInt(registration.expiryDate) * 1e3),
    registrationDate: new Date(parseInt(registration.registrationDate) * 1e3),
    ...registration.domain,
    name: decrypted,
    truncatedName: (0, import_format.truncateFormat)(decrypted),
    type: "registration"
  };
};
const getNames = async ({ gqlInstance }, {
  address: _address,
  type,
  page,
  pageSize = 10,
  orderDirection,
  orderBy = "labelName"
}) => {
  const address = _address.toLowerCase();
  const client = gqlInstance.client;
  const domainQueryData = `
    id
    labelName
    labelhash
    name
    isMigrated
    parent {
        name
    }
  `;
  let queryVars = {};
  let finalQuery = "";
  if (type === "all") {
    finalQuery = gqlInstance.gql`
      query getNames(
        $id: ID!
        $expiryDate: Int
      ) {
        account(id: $id) {
          registrations(
            first: 1000
            where: { expiryDate_gt: $expiryDate }
          ) {
            registrationDate
            expiryDate
            domain {
              ${domainQueryData}
            }
          }
          domains(first: 1000) {
            ${domainQueryData}
            createdAt
          }
        }
      }
    `;
    queryVars = {
      id: address,
      expiryDate: Math.floor(Date.now() / 1e3) - 90 * 24 * 60 * 60
    };
  } else if (type === "owner") {
    if (typeof page !== "number") {
      finalQuery = gqlInstance.gql`
        query getNames(
          $id: ID! 
          $orderBy: Domain_orderBy 
          $orderDirection: OrderDirection
        ) {
          account(id: $id) {
            domains(orderBy: $orderBy, orderDirection: $orderDirection) {
              ${domainQueryData}
              createdAt
            }
          }
        }
      `;
      queryVars = {
        id: address,
        orderBy,
        orderDirection
      };
    } else {
      finalQuery = gqlInstance.gql`
        query getNames(
          $id: ID!
          $first: Int
          $skip: Int
          $orderBy: Domain_orderBy
          $orderDirection: OrderDirection
        ) {
          account(id: $id) {
            domains(
              first: $first
              skip: $skip
              orderBy: $orderBy
              orderDirection: $orderDirection
            ) {
              ${domainQueryData}
              createdAt
            }
          }
        }
      `;
      queryVars = {
        id: address,
        first: pageSize,
        skip: (page || 0) * pageSize,
        orderBy,
        orderDirection
      };
    }
  } else if (typeof page !== "number") {
    finalQuery = gqlInstance.gql`
        query getNames(
          $id: ID!
          $orderBy: Registration_orderBy
          $orderDirection: OrderDirection
          $expiryDate: Int
        ) {
          account(id: $id) {
            registrations(
              orderBy: $orderBy
              orderDirection: $orderDirection
              where: { expiryDate_gt: $expiryDate }
            ) {
              registrationDate
              expiryDate
              domain {
                ${domainQueryData}
              }
            }
          }
        }
      `;
    queryVars = {
      id: address,
      orderBy,
      orderDirection,
      expiryDate: Math.floor(Date.now() / 1e3) - 90 * 24 * 60 * 60
    };
  } else {
    finalQuery = gqlInstance.gql`
        query getNames(
          $id: ID!
          $first: Int
          $skip: Int
          $orderBy: Registration_orderBy
          $orderDirection: OrderDirection
          $expiryDate: Int
        ) {
          account(id: $id) {
            registrations(
              first: $first
              skip: $skip
              orderBy: $orderBy
              orderDirection: $orderDirection
              where: { expiryDate_gt: $expiryDate }
            ) {
              registrationDate
              expiryDate
              domain {
                ${domainQueryData}
              }
            }
          }
        }
      `;
    queryVars = {
      id: address,
      first: pageSize,
      skip: (page || 0) * pageSize,
      orderBy,
      orderDirection,
      expiryDate: Math.floor(Date.now() / 1e3) - 90 * 24 * 60 * 60
    };
  }
  const { account } = await client.request(finalQuery, queryVars);
  if (type === "all") {
    return [
      ...account.domains.map(mapDomain),
      ...account.registrations.map(mapRegistration)
    ].sort((a, b) => {
      if (orderDirection === "desc") {
        if (orderBy === "labelName") {
          return b.name.localeCompare(a.name);
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (orderBy === "labelName") {
        return a.name.localeCompare(b.name);
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
  }
  if (type === "owner") {
    return account.domains.map(mapDomain);
  }
  return account.registrations.map(mapRegistration);
};
var getNames_default = getNames;
