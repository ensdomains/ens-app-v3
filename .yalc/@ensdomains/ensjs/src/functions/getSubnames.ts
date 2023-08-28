import { ENSArgs } from '..'
import {
  ENSJSError,
  getClientErrors,
  debugSubgraphLatency,
} from '../utils/errors'
import { truncateFormat } from '../utils/format'
import { AllCurrentFuses, checkPCCBurned, decodeFuses } from '../utils/fuses'
import { decryptName } from '../utils/labels'
import { namehash } from '../utils/normalise'
import { Domain } from '../utils/subgraph-types'

type BaseSubname = {
  id: string
  labelName: string | null
  truncatedName?: string
  labelhash: string
  isMigrated: boolean
  name: string
  owner: string | undefined
}

type UnwrappedSubname = BaseSubname & {
  fuses?: never
  expiryDate?: never
  pccExpired?: never
  type: 'domain'
}

type WrappedSubname = BaseSubname & {
  fuses: AllCurrentFuses
  expiryDate: Date
  pccExpired: boolean
  type: 'wrappedDomain'
}

type Subname = WrappedSubname | UnwrappedSubname

type ReturnData = {
  subnames: Subname[]
  subnameCount: number
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
  { gqlInstance, contracts }: ENSArgs<'gqlInstance' | 'contracts'>,
  {
    name,
    pageSize = 10,
    orderDirection,
    orderBy,
    lastSubnames = [],
    search = '',
  }: Params,
) => {
  const nameWrapper = await contracts?.getNameWrapper()
  const nameWrapperAddress = nameWrapper?.address.toLowerCase()

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
          wrappedDomain {
            fuses
            expiryDate
            owner {
              id
            }
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
  const response = await client
    .request(finalQuery, queryVars)
    .catch((e) => {
      throw new ENSJSError({
        data: {
          subnames: [],
          subnameCount: 0,
        },
        errors: getClientErrors(e),
      })
    })
    .finally(debugSubgraphLatency)

  const domain = response?.domain || { subdomains: [], subdomainCount: 0 }
  const subdomains = domain.subdomains.map(
    ({ wrappedDomain, ...subname }: Domain) => {
      const decrypted = decryptName(subname.name!)

      const obj = {
        ...subname,
        labelName: subname.labelName || null,
        labelhash: subname.labelhash || '',
        name: decrypted,
        truncatedName: truncateFormat(decrypted),
        owner: subname.owner.id,
        type: 'domain',
      } as Subname

      // If the subname is wrapped, we need to verfiy that it is wrapped by checking the registry owner
      if (wrappedDomain && obj.owner === nameWrapperAddress) {
        obj.type = 'wrappedDomain'
        const expiryDateAsDate =
          wrappedDomain.expiryDate && wrappedDomain.expiryDate !== '0'
            ? new Date(parseInt(wrappedDomain.expiryDate) * 1000)
            : undefined
        // if a user's local time is out of sync with the blockchain, this could potentially
        // be incorrect. the likelihood of that happening though is very low, and devs
        // shouldn't be relying on this value for anything critical anyway.
        const hasExpired = expiryDateAsDate && expiryDateAsDate < new Date()
        obj.expiryDate = expiryDateAsDate
        obj.fuses = decodeFuses(hasExpired ? 0 : wrappedDomain.fuses)
        obj.pccExpired = hasExpired
          ? checkPCCBurned(wrappedDomain.fuses)
          : false
        obj.owner = obj.pccExpired ? undefined : wrappedDomain.owner.id
      }

      return obj
    },
  )

  return {
    subnames: subdomains as Subname[],
    subnameCount: domain.subdomainCount,
  }
}

const getSubnames = (
  injected: ENSArgs<'gqlInstance' | 'contracts'>,
  functionArgs: Params,
): Promise<ReturnData> => {
  return largeQuery(injected, functionArgs)
}

export default getSubnames
