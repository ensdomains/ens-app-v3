import { ENSArgs } from '..'
import { truncateFormat } from '../utils/format'
import { AllCurrentFuses, decodeFuses } from '../utils/fuses'
import { decryptName } from '../utils/labels'
import { Domain, Registration, WrappedDomain } from '../utils/subgraph-types'

export type Name = {
  id: string
  labelName: string | null
  truncatedName?: string
  labelhash: string
  isMigrated: boolean
  name: string
  parent: {
    name: string
  }
  createdAt?: Date
  registrationDate?: Date
  expiryDate?: Date
  fuses?: AllCurrentFuses
  registration?: {
    expiryDate: Date
    registrationDate: Date
  }
  type: 'domain' | 'registration' | 'wrappedDomain'
}

type BaseParams = {
  address: string
  type: 'registrant' | 'owner' | 'wrappedOwner' | 'all'
  page?: number
  pageSize?: number
  orderDirection?: 'asc' | 'desc'
}

type RegistrantParams = {
  type: 'registrant'
  orderBy?: 'registrationDate' | 'expiryDate' | 'labelName'
}

type OwnerParams = {
  type: 'owner'
  orderBy?: 'createdAt' | 'labelName'
}

type WrappedOwnerParams = {
  type: 'wrappedOwner'
  orderBy?: 'expiryDate' | 'name'
}

type AllParams = {
  type: 'all'
  orderBy?: 'labelName' | 'creationDate'
  page?: never
  pageSize?: never
}

type Params = BaseParams &
  (RegistrantParams | OwnerParams | WrappedOwnerParams | AllParams)

const mapDomain = ({ name, ...domain }: Domain) => {
  const decrypted = name ? decryptName(name) : undefined
  return {
    ...domain,
    name: decrypted,
    truncatedName: decrypted ? truncateFormat(decrypted) : undefined,
    createdAt: new Date(parseInt(domain.createdAt) * 1000),
    type: 'domain',
  }
}

const mapWrappedDomain = (wrappedDomain: WrappedDomain) => {
  const domain = mapDomain(wrappedDomain.domain) as Omit<
    ReturnType<typeof mapDomain>,
    'registration'
  > & {
    registration?: {
      expiryDate: string | Date
      registrationDate: string | Date
    }
  }
  if (domain.registration) {
    domain.registration = {
      expiryDate: new Date(
        parseInt(domain.registration.expiryDate as string) * 1000,
      ),
      registrationDate: new Date(
        parseInt(domain.registration.registrationDate as string) * 1000,
      ),
    }
  }
  return {
    expiryDate: new Date(parseInt(wrappedDomain.expiryDate) * 1000),
    fuses: decodeFuses(wrappedDomain.fuses),
    ...domain,
    type: 'wrappedDomain',
  }
}

const mapRegistration = (registration: Registration) => {
  const decrypted = decryptName(registration.domain.name!)
  return {
    expiryDate: new Date(parseInt(registration.expiryDate) * 1000),
    registrationDate: new Date(parseInt(registration.registrationDate) * 1000),
    ...registration.domain,
    name: decrypted,
    truncatedName: truncateFormat(decrypted),
    type: 'registration',
  }
}

const getNames = async (
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  {
    address: _address,
    type,
    page,
    pageSize = 10,
    orderDirection,
    orderBy = 'labelName',
  }: Params,
) => {
  const address = _address.toLowerCase()
  const client = gqlInstance.client!
  const domainQueryData = `
    id
    labelName
    labelhash
    name
    isMigrated
    parent {
        name
    }
  `

  let queryVars: object = {}
  let finalQuery: string = ''

  if (type === 'all') {
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
    `
    queryVars = {
      id: address,
      expiryDate: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
    }
  } else if (type === 'owner') {
    if (typeof page !== 'number') {
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
      `
      queryVars = {
        id: address,
        orderBy,
        orderDirection,
      }
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
      `

      queryVars = {
        id: address,
        first: pageSize,
        skip: (page || 0) * pageSize,
        orderBy,
        orderDirection,
      }
    }
  } else if (type === 'wrappedOwner') {
    if (typeof page !== 'number') {
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
    `

      queryVars = {
        id: address,
        expiryDate: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
      }
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
    `

      queryVars = {
        id: address,
        first: pageSize,
        skip: (page || 0) * pageSize,
        orderBy: orderBy === 'labelName' ? 'name' : orderBy,
        orderDirection,
      }
    }
  } else if (typeof page !== 'number') {
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
      `

    queryVars = {
      id: address,
      orderBy,
      orderDirection,
      expiryDate: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
    }
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
      `

    queryVars = {
      id: address,
      first: pageSize,
      skip: (page || 0) * pageSize,
      orderBy,
      orderDirection,
      expiryDate: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
    }
  }

  const response = await client.request(finalQuery, queryVars)
  const account = response?.account
  if (type === 'all') {
    return [
      ...(account?.domains.map(mapDomain) || []),
      ...(account?.registrations.map(mapRegistration) || []),
      ...(account?.wrappedDomains.map(mapWrappedDomain) || []),
    ].sort((a, b) => {
      if (orderDirection === 'desc') {
        if (orderBy === 'labelName') {
          return b.name.localeCompare(a.name)
        }
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
      if (orderBy === 'labelName') {
        return a.name.localeCompare(b.name)
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    }) as Name[]
  }
  if (type === 'owner') {
    return (account?.domains.map(mapDomain) || []) as Name[]
  }
  if (type === 'wrappedOwner') {
    return (account?.wrappedDomains.map(mapWrappedDomain) || []) as Name[]
  }
  return (account?.registrations.map(mapRegistration) || []) as Name[]
}

export default getNames
