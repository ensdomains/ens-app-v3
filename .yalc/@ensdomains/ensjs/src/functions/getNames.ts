import { ENSArgs } from '..'
import { truncateFormat } from '../utils/format'
import { decryptName } from '../utils/labels'

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
  type: 'domain' | 'registration'
}

type BaseParams = {
  address: string
  type: 'registrant' | 'owner' | 'all'
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

type AllParams = {
  type: 'all'
  orderBy?: 'labelName' | 'creationDate'
  page?: never
  pageSize?: never
}

type Params = BaseParams & (RegistrantParams | OwnerParams | AllParams)

const mapDomain = (domain: any) => {
  const decrypted = decryptName(domain.name)
  return {
    ...domain,
    name: decrypted,
    truncatedName: truncateFormat(decrypted),
    createdAt: new Date(parseInt(domain.createdAt) * 1000),
    type: 'domain',
  }
}

const mapRegistration = (registration: any) => {
  const decrypted = decryptName(registration.domain.name)
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
    orderBy,
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

  const { account } = await client.request(finalQuery, queryVars)
  if (type === 'all') {
    return [
      ...account.domains.map(mapDomain),
      ...account.registrations.map(mapRegistration),
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
    return account.domains.map(mapDomain) as Name[]
  }
  return account.registrations.map(mapRegistration) as Name[]
}

export default getNames
