import { ENSArgs } from '..'
import { truncateFormat } from '../utils/format'
import { decryptName } from '../utils/labels'
import { namehash } from '../utils/normalise'

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
  lastSubnames?: Array<any>
  search?: string
}

const largeQuery = async (
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  {
    name,
    pageSize = 10,
    orderDirection,
    orderBy,
    lastSubnames = [],
    search = '',
  }: Params,
) => {
  const { client } = gqlInstance

  const lastSubname = lastSubnames?.[lastSubnames.length - 1]
  const lastCreatedAt = lastSubname?.createdAt
  const lastLabelName = lastSubname?.labelName

  let whereFilter = ''
  if (orderBy === 'createdAt' && lastCreatedAt) {
    whereFilter +=
      orderDirection === 'asc'
        ? 'createdAt_gt: $lastCreatedAt'
        : 'createdAt_lt: $lastCreatedAt'
  } else if (orderBy === 'labelName' && lastLabelName) {
    whereFilter +=
      orderDirection === 'asc'
        ? 'labelName_gt: $lastLabelName'
        : 'labelName_lt: $lastLabelName'
  }
  if (search) {
    whereFilter += ' labelName_contains: $search'
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
        }
      }
    }
  `

  const queryVars = {
    id: namehash(name),
    first: pageSize,
    lastCreatedAt,
    lastLabelName,
    orderBy,
    orderDirection,
    search: search?.toLowerCase(),
  }
  const { domain } = await client.request(finalQuery, queryVars)
  const subdomains = domain.subdomains.map((subname: any) => {
    const decrypted = decryptName(subname.name)

    return {
      ...subname,
      name: decrypted,
      truncatedName: truncateFormat(decrypted),
    }
  })

  return {
    subnames: subdomains,
    subnameCount: domain.subdomainCount,
  }
}

const getSubnames = (
  injected: ENSArgs<'gqlInstance'>,
  functionArgs: Params,
): Promise<{ subnames: Subname[]; subnameCount: number }> => {
  return largeQuery(injected, functionArgs)
}

export default getSubnames
