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
var import_errors = require("../utils/errors");
var import_format = require("../utils/format");
var import_fuses = require("../utils/fuses");
var import_labels = require("../utils/labels");
const mapDomain = (domain) => {
  if (!domain)
    return {};
  const decrypted = domain.name ? (0, import_labels.decryptName)(domain.name) : void 0;
  return {
    ...domain,
    ...domain.registration ? {
      registration: {
        expiryDate: new Date(
          parseInt(domain.registration.expiryDate) * 1e3
        ),
        registrationDate: new Date(
          parseInt(domain.registration.registrationDate) * 1e3
        )
      }
    } : {},
    name: decrypted,
    truncatedName: decrypted ? (0, import_format.truncateFormat)(decrypted) : void 0,
    createdAt: new Date(parseInt(domain.createdAt) * 1e3),
    type: "domain"
  };
};
const mapWrappedDomain = (wrappedDomain) => {
  const expiryDate = wrappedDomain.expiryDate && wrappedDomain.expiryDate !== "0" ? new Date(parseInt(wrappedDomain.expiryDate) * 1e3) : void 0;
  if (expiryDate && expiryDate < new Date() && (0, import_fuses.checkPCCBurned)(wrappedDomain.fuses)) {
    return null;
  }
  const domain = mapDomain(wrappedDomain.domain);
  return {
    expiryDate,
    fuses: (0, import_fuses.decodeFuses)(wrappedDomain.fuses),
    ...domain,
    type: "wrappedDomain"
  };
};
const mapRegistration = (registration) => {
  const decrypted = (0, import_labels.decryptName)(registration.domain.name);
  const domain = mapDomain(registration.domain);
  return {
    expiryDate: new Date(parseInt(registration.expiryDate) * 1e3),
    registrationDate: new Date(parseInt(registration.registrationDate) * 1e3),
    ...domain,
    name: decrypted,
    truncatedName: (0, import_format.truncateFormat)(decrypted),
    type: "registration"
  };
};
const mapResolvedAddress = ({
  wrappedDomain,
  registration,
  ...domain
}) => {
  const mappedDomain = mapDomain(domain);
  if (wrappedDomain) {
    const mappedWrappedDomain = mapWrappedDomain(wrappedDomain);
    if (!mappedWrappedDomain)
      return null;
    return {
      ...mappedDomain,
      ...mappedWrappedDomain,
      owner: wrappedDomain.owner.id
    };
  }
  return {
    ...mappedDomain,
    ...registration ? {
      expiryDate: new Date(parseInt(registration.expiryDate) * 1e3),
      registrationDate: new Date(
        parseInt(registration.registrationDate) * 1e3
      ),
      owner: registration.registrant.id
    } : {},
    manager: domain.owner.id
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
    createdAt
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
            registration {
              registrationDate
              expiryDate
            }
          }
          wrappedDomains(first: 1000) {
            expiryDate
            fuses
            domain {
              ${domainQueryData}
              registration {
                registrationDate
                expiryDate
              }
            }
          }
        }
      }
    `;
    queryVars = {
      id: address,
      expiryDate: Math.floor(Date.now() / 1e3) - 90 * 24 * 60 * 60
    };
  } else if (type === "resolvedAddress") {
    finalQuery = gqlInstance.gql`
    query getNames(
      $id: String!
      $orderBy: Domain_orderBy
      $orderDirection: OrderDirection
    ) {
      domains(
        first: 1000
        where: { 
           resolvedAddress: $id 
        }
        orderBy: $orderBy
        orderDirection: $orderDirection
      ) {
        ${domainQueryData}
        owner {
          id
        }
        registration {
          registrationDate
          expiryDate
          registrant {
            id
          }
        }
        wrappedDomain {
          expiryDate
          fuses
          owner {
            id
          }
        }
      }
    }`;
    queryVars = {
      id: address,
      orderBy: orderBy === "labelName" ? "labelName" : "createdAt",
      orderDirection: orderDirection === "asc" ? "asc" : "desc"
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
              registration {
                registrationDate
                expiryDate
              }
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
  } else if (type === "wrappedOwner") {
    if (typeof page !== "number") {
      finalQuery = gqlInstance.gql`
      query getNames(
        $id: ID!
        $orderBy: WrappedDomain_orderBy
        $orderDirection: OrderDirection
        $expiryDate: Int
      ) {
        account(id: $id) {
          wrappedDomains(
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: { expiryDate_gt: $expiryDate }
          ) {
            expiryDate
            fuses
            domain {
              ${domainQueryData}
            }
          }
        }
      }
    `;
      queryVars = {
        id: address,
        expiryDate: Math.floor(Date.now() / 1e3) - 90 * 24 * 60 * 60
      };
    } else {
      finalQuery = gqlInstance.gql`
      query getNames(
        $id: ID!
        $first: Int
        $skip: Int
        $orderBy: WrappedDomain_orderBy
        $orderDirection: OrderDirection
      ) {
        account(id: $id) {
          wrappedDomains(
            first: $first
            skip: $skip
            orderBy: $orderBy
            orderDirection: $orderDirection
          ) {
            expiryDate
            fuses
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
        orderBy: orderBy === "labelName" ? "name" : orderBy,
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
  const response = await client.request(finalQuery, queryVars).catch((e) => {
    console.error(e);
    throw new import_errors.ENSJSError({
      errors: (0, import_errors.getClientErrors)(e),
      data: []
    });
  }).finally(import_errors.debugSubgraphLatency);
  const account = response == null ? void 0 : response.account;
  if (type === "all") {
    const data = [
      ...(account == null ? void 0 : account.domains.map(mapDomain)) || [],
      ...(account == null ? void 0 : account.registrations.map(mapRegistration)) || [],
      ...(account == null ? void 0 : account.wrappedDomains.map(mapWrappedDomain).filter((d) => d)) || []
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
    return data;
  }
  if (type === "resolvedAddress") {
    return (response == null ? void 0 : response.domains.map(mapResolvedAddress).filter((d) => d)) || [];
  }
  if (type === "owner") {
    return (account == null ? void 0 : account.domains.map(mapDomain)) || [];
  }
  if (type === "wrappedOwner") {
    return (account == null ? void 0 : account.wrappedDomains.map(mapWrappedDomain).filter((d) => d)) || [];
  }
  return (account == null ? void 0 : account.registrations.map(mapRegistration)) || [];
};
var getNames_default = getNames;
