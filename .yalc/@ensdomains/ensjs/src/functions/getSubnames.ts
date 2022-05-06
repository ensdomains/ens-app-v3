import { namehash } from 'ethers/lib/utils'
import { ENSArgs } from '..'
import { truncateFormat } from '../utils/format'
import { decryptName } from '../utils/labels'

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
}

const getSubnames = async (
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  { name, page, pageSize = 10, orderDirection, orderBy }: Params,
): Promise<Subname[]> => {
  const client = gqlInstance.client!
  const subdomainsGql = `
    id
    labelName
    labelhash
    isMigrated
    name
    owner {
      id
    }
  `
  let queryVars: object = {}
  let finalQuery: string = ''

  if (typeof page !== 'number') {
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
    `

    queryVars = {
      id: namehash(name),
      orderBy,
      orderDirection,
    }
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
    `

    queryVars = {
      id: namehash(name),
      first: pageSize,
      skip: (page || 0) * pageSize,
      orderBy,
      orderDirection,
    }
  }

  const { domain } = await client.request(finalQuery, queryVars)
  return (domain.subdomains as Subname[]).map((subname) => {
    const decrypted = decryptName(subname.name)
    return {
      ...subname,
      name: decrypted,
      truncatedName: truncateFormat(decrypted),
    }
  })
}

export default getSubnames
