import { namehash } from 'ethers/lib/utils';
import { truncateFormat } from '../utils/format';
import { decryptName } from '../utils/labels';
const getSubnames = async ({ gqlInstance }, { name, page, pageSize = 10, orderDirection, orderBy }) => {
    const client = gqlInstance.client;
    const subdomainsGql = `
    id
    labelName
    labelhash
    isMigrated
    name
    owner {
      id
    }
  `;
    let queryVars = {};
    let finalQuery = '';
    if (typeof page !== 'number') {
        finalQuery = gqlInstance.gql `
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
            orderDirection,
        };
    }
    else {
        finalQuery = gqlInstance.gql `
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
            orderDirection,
        };
    }
    const { domain } = await client.request(finalQuery, queryVars);
    return domain.subdomains.map((subname) => {
        const decrypted = decryptName(subname.name);
        return {
            ...subname,
            name: decrypted,
            truncatedName: truncateFormat(decrypted),
        };
    });
};
export default getSubnames;
