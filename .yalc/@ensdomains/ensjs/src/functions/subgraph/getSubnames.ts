/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from 'graphql-request'
import type { ClientWithEns } from '../../contracts/consts.js'
import { InvalidOrderByError } from '../../errors/subgraph.js'
import { EMPTY_ADDRESS, GRACE_PERIOD_SECONDS } from '../../utils/consts.js'
import { namehash } from '../../utils/normalise.js'
import { createSubgraphClient } from './client.js'
import type { DomainFilter } from './filters.js'
import {
  domainDetailsWithoutParentFragment,
  registrationDetailsFragment,
  wrappedDomainDetailsFragment,
  type SubgraphDomain,
} from './fragments.js'
import { makeNameObject, type Name } from './utils.js'

type GetSubnamesOrderBy = 'expiryDate' | 'name' | 'labelName' | 'createdAt'

export type GetSubnamesParameters = {
  /** Name to get subnames for */
  name: string
  /** Search string filter for subname label */
  searchString?: string
  /** Allows expired names to be included (default: false) */
  allowExpired?: boolean
  /** Allows deleted names to be included (default: false) */
  allowDeleted?: boolean
  /** Parameter to order names by (default: name) */
  orderBy?: GetSubnamesOrderBy
  /** Direction to order names in (default: asc) */
  orderDirection?: 'asc' | 'desc'
  /** Previous page of subnames, used for pagination */
  previousPage?: Name[]
  /** Page size (default: 100) */
  pageSize?: number
}

export type GetSubnamesReturnType = Name[]

type SubgraphResult = {
  domain?: {
    subdomains: SubgraphDomain[]
  }
}

const getOrderByFilter = ({
  name,
  orderBy,
  orderDirection,
  previousPage,
}: Required<
  Pick<
    GetSubnamesParameters,
    'name' | 'orderBy' | 'orderDirection' | 'previousPage'
  >
>): DomainFilter => {
  const lastDomain = previousPage[previousPage.length - 1]
  const operator = orderDirection === 'asc' ? 'gt' : 'lt'

  switch (orderBy) {
    case 'expiryDate': {
      let lastExpiryDate = lastDomain.expiryDate?.value
        ? lastDomain.expiryDate.value / 1000
        : 0
      if (name === 'eth' && lastExpiryDate) {
        lastExpiryDate += GRACE_PERIOD_SECONDS
      }

      if (orderDirection === 'asc' && lastExpiryDate === 0) {
        return {
          and: [{ expiryDate: null }, { [`id_${operator}`]: lastDomain.id }],
        }
      }
      if (orderDirection === 'desc' && lastExpiryDate !== 0) {
        return {
          [`expiryDate_${operator}`]: `${lastExpiryDate}`,
        }
      }
      return {
        or: [
          {
            [`expiryDate_${operator}`]: `${lastExpiryDate}`,
          },
          { expiryDate: null },
        ],
      }
    }
    case 'name': {
      return {
        [`name_${operator}`]: lastDomain.name ?? '',
      }
    }
    case 'labelName': {
      return {
        [`labelName_${operator}`]: lastDomain.labelName ?? '',
      }
    }
    case 'createdAt': {
      return {
        [`createdAt_${operator}`]: `${lastDomain.createdAt.value / 1000}`,
      }
    }
    default:
      throw new InvalidOrderByError({
        orderBy: orderBy || '<no orderBy provided>',
        supportedOrderBys: ['expiryDate', 'name', 'labelName', 'createdAt'],
      })
  }
}

/**
 * Gets the subnames for a name from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetSubnamesParameters}
 * @returns Subname array. {@link GetSubnamesReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getSubnames } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getSubnames(client, { name: 'ens.eth' })
 */
const getSubnames = async (
  client: ClientWithEns,
  {
    name,
    searchString,
    allowExpired = false,
    allowDeleted = false,
    orderBy = 'name',
    orderDirection = 'asc',
    pageSize = 100,
    previousPage,
  }: GetSubnamesParameters,
): Promise<GetSubnamesReturnType> => {
  const subgraphClient = createSubgraphClient({ client })

  const whereFilters: DomainFilter[] = []

  if (previousPage?.length) {
    whereFilters.push(
      getOrderByFilter({
        name,
        orderBy,
        orderDirection,
        previousPage,
      }),
    )
  }

  if (!allowExpired) {
    // Exclude domains that are expired
    // if expiryDate is null, there is no expiry on the domain (registration or wrapped)
    whereFilters.push({
      or: [
        { expiryDate_gt: `${Math.floor(Date.now() / 1000)}` },
        { expiryDate: null },
      ],
    })
  }

  if (!allowDeleted) {
    // exclude "deleted" domains
    // when owner/resolver/registrant = null
    whereFilters.push({
      or: [
        {
          owner_not: EMPTY_ADDRESS,
        },
        {
          resolver_not: null,
        },
        ...(name.toLowerCase() === 'eth'
          ? [
              {
                registrant_not: EMPTY_ADDRESS,
              },
            ]
          : []),
      ],
    })
  }

  if (searchString) {
    // using labelName_contains instead of name_contains because name_contains
    // includes the parent name
    whereFilters.push({
      labelName_contains: searchString,
    })
  }

  let whereFilter: DomainFilter = {}

  if (whereFilters.length > 1) {
    whereFilter = {
      and: whereFilters,
    }
  } else if (whereFilters.length === 1) {
    ;[whereFilter] = whereFilters
  }

  const query = gql`
    query getSubnames(
      $id: String!
      $orderBy: Domain_orderBy
      $orderDirection: OrderDirection
      $whereFilter: Domain_filter
      $first: Int
    ) {
      domain(id: $id) {
        subdomains(
          orderBy: $orderBy
          orderDirection: $orderDirection
          first: $first
          where: $whereFilter
        ) {
          ...DomainDetailsWithoutParent
          registration {
            ...RegistrationDetails
          }
          wrappedDomain {
            ...WrappedDomainDetails
          }
        }
      }
    }
    ${domainDetailsWithoutParentFragment}
    ${registrationDetailsFragment}
    ${wrappedDomainDetailsFragment}
  `

  const queryVars = {
    id: namehash(name),
    orderBy,
    orderDirection,
    first: pageSize,
    whereFilter,
  }

  const result = await subgraphClient.request<SubgraphResult, typeof queryVars>(
    query,
    queryVars,
  )

  if (!result.domain) return []

  const names = result.domain.subdomains.map((domain) =>
    makeNameObject({ ...domain, parent: { name } }),
  )

  return names
}

export default getSubnames
