// src/functions/getNames.ts
import {
  getClientErrors,
  ENSJSError,
  debugSubgraphLatency
} from "../utils/errors.mjs";
import { truncateFormat } from "../utils/format.mjs";
import { checkPCCBurned, decodeFuses } from "../utils/fuses.mjs";
import { decryptName } from "../utils/labels.mjs";
var mapDomain = (domain) => {
  if (!domain)
    return {};
  const decrypted = domain.name ? decryptName(domain.name) : void 0;
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
    truncatedName: decrypted ? truncateFormat(decrypted) : void 0,
    createdAt: new Date(parseInt(domain.createdAt) * 1e3),
    type: "domain"
  };
};
var mapWrappedDomain = (wrappedDomain) => {
  const expiryDate = wrappedDomain.expiryDate && wrappedDomain.expiryDate !== "0" ? new Date(parseInt(wrappedDomain.expiryDate) * 1e3) : void 0;
  if (expiryDate && expiryDate < new Date() && checkPCCBurned(wrappedDomain.fuses)) {
    return null;
  }
  const domain = mapDomain(wrappedDomain.domain);
  return {
    expiryDate,
    fuses: decodeFuses(wrappedDomain.fuses),
    ...domain,
    type: "wrappedDomain"
  };
};
var mapRegistration = (registration) => {
  const decrypted = decryptName(registration.domain.name);
  const domain = mapDomain(registration.domain);
  return {
    expiryDate: new Date(parseInt(registration.expiryDate) * 1e3),
    registrationDate: new Date(parseInt(registration.registrationDate) * 1e3),
    ...domain,
    name: decrypted,
    truncatedName: truncateFormat(decrypted),
    type: "registration"
  };
};
var mapResolvedAddress = ({
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
    throw new ENSJSError({
      errors: getClientErrors(e),
      data: []
    });
  }).finally(debugSubgraphLatency);
  const account = response?.account;
  if (type === "all") {
    const data = [
      ...account?.domains.map(mapDomain) || [],
      ...account?.registrations.map(mapRegistration) || [],
      ...account?.wrappedDomains.map(mapWrappedDomain).filter((d) => d) || []
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
    return response?.domains.map(mapResolvedAddress).filter((d) => d) || [];
  }
  if (type === "owner") {
    return account?.domains.map(mapDomain) || [];
  }
  if (type === "wrappedOwner") {
    return account?.wrappedDomains.map(mapWrappedDomain).filter((d) => d) || [];
  }
  return account?.registrations.map(mapRegistration) || [];
};
var getNames_default = getNames;
export {
  getNames_default as default
};
