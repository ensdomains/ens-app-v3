// src/functions/getNames.ts
import { truncateFormat } from "../utils/format.mjs";
import { decodeFuses } from "../utils/fuses.mjs";
import { decryptName } from "../utils/labels.mjs";
var mapDomain = (domain) => {
  const decrypted = decryptName(domain.name);
  return {
    ...domain,
    name: decrypted,
    truncatedName: truncateFormat(decrypted),
    createdAt: new Date(parseInt(domain.createdAt) * 1e3),
    type: "domain"
  };
};
var mapWrappedDomain = (wrappedDomain) => {
  const domain = mapDomain(wrappedDomain.domain);
  if (domain.registration) {
    domain.registration = {
      expiryDate: new Date(parseInt(domain.registration.expiryDate) * 1e3),
      registrationDate: new Date(domain.registration.registrationDate * 1e3)
    };
  }
  return {
    expiryDate: new Date(parseInt(wrappedDomain.expiryDate) * 1e3),
    fuses: decodeFuses(wrappedDomain.fuses),
    ...domain,
    type: "wrappedDomain"
  };
};
var mapRegistration = (registration) => {
  const decrypted = decryptName(registration.domain.name);
  return {
    expiryDate: new Date(parseInt(registration.expiryDate) * 1e3),
    registrationDate: new Date(parseInt(registration.registrationDate) * 1e3),
    ...registration.domain,
    name: decrypted,
    truncatedName: truncateFormat(decrypted),
    type: "registration"
  };
};
var getNames = async ({ gqlInstance }, {
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
              createdAt
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
              createdAt
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
      ...account.registrations.map(mapRegistration),
      ...account.wrappedDomains.map(mapWrappedDomain)
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
  if (type === "wrappedOwner") {
    return account.wrappedDomains.map(mapWrappedDomain);
  }
  return account.registrations.map(mapRegistration);
};
var getNames_default = getNames;
export {
  getNames_default as default
};
