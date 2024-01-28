import { gql } from 'graphql-request'
import type { Address, Hex } from 'viem'

export const domainDetailsWithoutParentFragment = gql`
  fragment DomainDetailsWithoutParent on Domain {
    id
    labelName
    labelhash
    name
    isMigrated
    createdAt
    resolvedAddress {
      id
    }
    owner {
      id
    }
    registrant {
      id
    }
    wrappedOwner {
      id
    }
  }
`

export const domainDetailsFragment = gql`
  fragment DomainDetails on Domain {
    ...DomainDetailsWithoutParent
    parent {
      name
    }
  }
  ${domainDetailsWithoutParentFragment}
`

export type SubgraphDomainFragment = {
  id: Hex
  labelName: string | null
  labelhash: Hex
  name: string
  isMigrated: boolean
  parent?: {
    name: string
  }
  createdAt: string
  resolvedAddress?: {
    id: Address
  }
  owner: {
    id: Address
  }
  registrant?: {
    id: Address
  }
  wrappedOwner?: {
    id: Address
  }
}

export const registrationDetailsFragment = gql`
  fragment RegistrationDetails on Registration {
    registrationDate
    expiryDate
  }
`

export type SubgraphRegistrationFragment = {
  registrationDate: string
  expiryDate: string
}

export const wrappedDomainDetailsFragment = gql`
  fragment WrappedDomainDetails on WrappedDomain {
    expiryDate
    fuses
  }
`

export type SubgraphWrappedDomainFragment = {
  expiryDate: string
  fuses: string
}

export type SubgraphDomain = SubgraphDomainFragment & {
  registration?: SubgraphRegistrationFragment
  wrappedDomain?: SubgraphWrappedDomainFragment
}
