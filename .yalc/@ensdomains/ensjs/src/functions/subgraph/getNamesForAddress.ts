/* eslint-disable @typescript-eslint/naming-convention */
import { gql } from 'graphql-request'
import type { Address } from 'viem'
import type { ClientWithEns } from '../../contracts/consts.js'
import {
  FilterKeyRequiredError,
  InvalidFilterKeyError,
  InvalidOrderByError,
} from '../../errors/subgraph.js'
import { EMPTY_ADDRESS, GRACE_PERIOD_SECONDS } from '../../utils/consts.js'
import { createSubgraphClient } from './client.js'
import type { DomainFilter } from './filters.js'
import {
  domainDetailsFragment,
  registrationDetailsFragment,
  wrappedDomainDetailsFragment,
  type SubgraphDomain,
} from './fragments.js'
import { makeNameObject, type Name } from './utils.js'

const supportedOwnerFilters = [
  'owner',
  'registrant',
  'wrappedOwner',
  'resolvedAddress',
] as const

type GetNamesForAddressOrderBy =
  | 'expiryDate'
  | 'name'
  | 'labelName'
  | 'createdAt'

type GetNamesForAddressRelation = {
  /** Names with registrant as address (default: true) */
  registrant?: boolean
  /** Names with owner as address (default: true) */
  owner?: boolean
  /** Names with wrapped owner as address (default: true) */
  wrappedOwner?: boolean
  /** Names with matching resolving address (default: true) */
  resolvedAddress?: boolean
}

type GetNamesForAddressFilter = GetNamesForAddressRelation & {
  /** Search string filter for subname label */
  searchString?: string
  /** Allows expired names to be included (default: false) */
  allowExpired?: boolean
  /** Allows reverse record nodes to be included (default: false) */
  allowReverseRecord?: boolean
  /** Allows deleted names to be included (default: false) */
  allowDeleted?: boolean
}

export type GetNamesForAddressParameters = {
  /** Address to get names for */
  address: Address
  /** Names to get, in relation to address */
  filter?: GetNamesForAddressFilter
  /** Parameter to order names by (default: name) */
  orderBy?: GetNamesForAddressOrderBy
  /** Direction to order names in (default: asc) */
  orderDirection?: 'asc' | 'desc'
  /** Previous page of names, used for pagination */
  previousPage?: NameWithRelation[]
  /** Page size (default: 100) */
  pageSize?: number
}

export type NameWithRelation = Name & {
  relation: GetNamesForAddressRelation
}

export type GetNamesForAddressReturnType = NameWithRelation[]

type SubgraphResult = {
  domains: SubgraphDomain[]
}

const getOrderByFilter = ({
  orderBy,
  orderDirection,
  previousPage,
}: Required<
  Pick<
    GetNamesForAddressParameters,
    'orderBy' | 'orderDirection' | 'previousPage'
  >
>): DomainFilter => {
  const lastDomain = previousPage[previousPage.length - 1]
  const operator = orderDirection === 'asc' ? 'gt' : 'lt'

  switch (orderBy) {
    case 'expiryDate': {
      let lastExpiryDate = lastDomain.expiryDate?.value
        ? lastDomain.expiryDate.value / 1000
        : 0
      if (lastDomain.parentName === 'eth') {
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
 * Gets the names for an address from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetNamesForAddressParameters}
 * @returns Name array. {@link GetNamesForAddressReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getNamesForAddress } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getNamesForAddress(client, { address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' })
 */
const getNamesForAddress = async (
  client: ClientWithEns,
  {
    address,
    filter: _filter,
    orderBy = 'name',
    orderDirection = 'asc',
    pageSize = 100,
    previousPage,
  }: GetNamesForAddressParameters,
): Promise<GetNamesForAddressReturnType> => {
  const filter = {
    owner: true,
    registrant: true,
    resolvedAddress: true,
    wrappedOwner: true,
    allowExpired: false,
    allowDeleted: false,
    allowReverseRecord: false,
    ..._filter,
  }

  const subgraphClient = createSubgraphClient({ client })

  const {
    allowExpired,
    allowDeleted,
    allowReverseRecord,
    searchString,
    ...filters
  } = filter
  const ownerWhereFilters: DomainFilter[] = Object.entries(filters).reduce(
    (prev, [key, value]) => {
      if (value) {
        if (!supportedOwnerFilters.includes(key as any))
          throw new InvalidFilterKeyError({
            filterKey: key,
            supportedFilterKeys: supportedOwnerFilters,
          })
        return [
          ...prev,
          {
            [key]: address.toLowerCase(),
          },
        ]
      }
      return prev
    },
    [] as DomainFilter[],
  )

  const hasFilterApplied = ownerWhereFilters.length > 0

  if (!hasFilterApplied)
    throw new FilterKeyRequiredError({
      supportedFilterKeys: supportedOwnerFilters,
      details: 'At least one ownership filter must be enabled',
    })

  const ownerWhereFilter: DomainFilter =
    ownerWhereFilters.length > 1
      ? { or: ownerWhereFilters }
      : ownerWhereFilters[0]
  const whereFilters: DomainFilter[] = [ownerWhereFilter]

  if (previousPage?.length) {
    whereFilters.push(
      getOrderByFilter({
        orderBy,
        orderDirection,
        previousPage,
      }),
    )
  }

  if (!allowReverseRecord) {
    // Exclude domains with parent addr.reverse
    // namehash of addr.reverse = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2
    whereFilters.push({
      parent_not:
        '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2',
    })
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
        {
          and: [
            {
              registrant_not: EMPTY_ADDRESS,
            },
            {
              registrant_not: null,
            },
          ],
        },
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

  const whereFilter: DomainFilter =
    whereFilters.length > 1 ? { and: whereFilters } : whereFilters[0]

  const query = gql`
    query getNamesForAddress(
      $orderBy: Domain_orderBy
      $orderDirection: OrderDirection
      $first: Int
      $whereFilter: Domain_filter
    ) {
      domains(
        orderBy: $orderBy
        orderDirection: $orderDirection
        first: $first
        where: $whereFilter
      ) {
        ...DomainDetails
        registration {
          ...RegistrationDetails
        }
        wrappedDomain {
          ...WrappedDomainDetails
        }
      }
    }
    ${domainDetailsFragment}
    ${registrationDetailsFragment}
    ${wrappedDomainDetailsFragment}
  `

  const result = await subgraphClient.request<
    SubgraphResult,
    {
      orderBy: string
      orderDirection: string
      first: number
      whereFilter: DomainFilter
    }
  >(query, {
    orderBy,
    orderDirection,
    first: pageSize,
    whereFilter,
  })

  if (!result) return []

  const names = result.domains.map((domain) => {
    const relation: GetNamesForAddressRelation = {}

    if (domain.owner) {
      relation.owner = domain.owner.id === address.toLowerCase()
    }
    if (domain.registrant) {
      relation.registrant = domain.registrant.id === address.toLowerCase()
    }
    if (domain.wrappedOwner) {
      relation.wrappedOwner = domain.wrappedOwner.id === address.toLowerCase()
    }
    if (domain.resolvedAddress) {
      relation.resolvedAddress =
        domain.resolvedAddress.id === address.toLowerCase()
    }

    return {
      ...makeNameObject(domain),
      relation,
    }
  })

  return names
}

export default getNamesForAddress
