import { namehash } from 'ethers/lib/utils';
import { ENSArgs } from '..'
import { truncateFormat } from '../utils/format';
import { decryptName } from '../utils/labels';

type Subname = {
  id: string
  labelName: string | null
  truncatedName?: string
  labelhash: string
  isMigrated: boolean
  name: string
  owner: {
    id: string
  }
}

type Params = {
  name: string
  page?: number
  pageSize?: number
  orderDirection?: 'asc' | 'desc'
  orderBy?: 'createdAt' | 'labelName'
  lastSubnames: Array<any>
  isLargeQuery?: boolean
}

const largeQuery = async (
    { gqlInstance } : ENSArgs<'gqlInstance'>, 
    { name, page, pageSize = 10, orderDirection, orderBy, lastSubnames }: Params
  ) => {
  const client = gqlInstance.client;

  let finalQuery = gqlInstance.gql `
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
     let queryVars = {
          id: namehash(name),
          first: pageSize,
          lastCreatedAt: lastSubnames[lastSubnames.length - 1]?.createdAt,
          orderBy,
          orderDirection,
      };
  const { domain } = await client.request(finalQuery, queryVars);
  const subdomains = domain.subdomains.map((subname: any) => {
      const decrypted = decryptName(subname.name);
      return {
          ...subname,
          name: decrypted,
          truncatedName: truncateFormat(decrypted),
      };
  });

  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount
  }
};

const smallQuery =  async (
  { gqlInstance } : ENSArgs<'gqlInstance'>, 
  { name, page, pageSize = 10, orderDirection, orderBy } : Params
  ) => {
  const client = gqlInstance.client;
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
          id: namehash(name),
          first: pageSize,
          skip: (page || 0) * pageSize,
          orderBy,
          orderDirection,
      };
  }
  const { domain } = await client.request(finalQuery, queryVars);
  const subdomains = domain.subdomains.map((subname: any) => {
      const decrypted = decryptName(subname.name);
      return {
          ...subname,
          name: decrypted,
          truncatedName: truncateFormat(decrypted),
      };
  });

  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount
  }
};

const getSubnames = (injected : ENSArgs<'gqlInstance'>, functionArgs: Params) => {
  if(functionArgs.isLargeQuery) {
    return largeQuery(injected, functionArgs)
  }  
  return smallQuery(injected, functionArgs)
}

export default getSubnames;
