import { truncateFormat } from '../utils/format';
import { decryptName } from '../utils/labels';
const getNames = async ({ gqlInstance }, { address: _address, type, page, pageSize = 10, orderDirection, orderBy, }) => {
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
    let finalQuery = '';
    if (type === 'owner') {
        if (typeof page !== 'number') {
            finalQuery = gqlInstance.gql `
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
                orderBy: orderBy,
                orderDirection: orderDirection,
            };
        }
        else {
            finalQuery = gqlInstance.gql `
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
                orderBy: orderBy,
                orderDirection: orderDirection,
            };
        }
    }
    else {
        if (typeof page !== 'number') {
            finalQuery = gqlInstance.gql `
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
                orderBy: orderBy,
                orderDirection: orderDirection,
                expiryDate: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
            };
        }
        else {
            finalQuery = gqlInstance.gql `
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
                orderBy: orderBy,
                orderDirection: orderDirection,
                expiryDate: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
            };
        }
    }
    const { account } = await client.request(finalQuery, queryVars);
    if (type === 'owner') {
        return account.domains.map((domain) => {
            const decrypted = decryptName(domain.name);
            return {
                ...domain,
                name: decrypted,
                truncatedName: truncateFormat(decrypted),
                createdAt: new Date(parseInt(domain.createdAt) * 1000),
            };
        });
    }
    return account.registrations.map((registration) => {
        const decrypted = decryptName(registration.domain.name);
        return {
            expiryDate: new Date(parseInt(registration.expiryDate) * 1000),
            registrationDate: new Date(parseInt(registration.registrationDate) * 1000),
            ...registration.domain,
            name: decrypted,
            truncatedName: truncateFormat(decrypted),
        };
    });
};
export default getNames;
