export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Bytes: string
  BigInt: string
}

export type Domain = {
  __typename?: 'Domain'
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  labelName?: Maybe<Scalars['String']>
  labelhash?: Maybe<Scalars['Bytes']>
  parent?: Maybe<Domain>
  subdomains: Array<Domain>
  subdomainCount: Scalars['Int']
  resolvedAddress?: Maybe<Account>
  owner: Account
  resolver?: Maybe<Resolver>
  ttl?: Maybe<Scalars['BigInt']>
  isMigrated: Scalars['Boolean']
  createdAt: Scalars['BigInt']
  events: Array<DomainEvent>
  registration?: Maybe<Registration>
  wrappedDomain?: Maybe<WrappedDomain>
}

export type DomainEvent = {
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
}

export type Transfer = DomainEvent & {
  __typename?: 'Transfer'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  owner: Account
}

export type NewOwner = DomainEvent & {
  __typename?: 'NewOwner'
  id: Scalars['ID']
  parentDomain: Domain
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  owner: Account
}

export type NewResolver = DomainEvent & {
  __typename?: 'NewResolver'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  resolver: Resolver
}

export type NewTtl = DomainEvent & {
  __typename?: 'NewTTL'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  ttl: Scalars['BigInt']
}

export type WrappedTransfer = DomainEvent & {
  __typename?: 'WrappedTransfer'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  owner: Account
}

export type NameWrapped = DomainEvent & {
  __typename?: 'NameWrapped'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  name: Scalars['String']
  fuses: Scalars['Int']
  owner: Account
  expiryDate: Scalars['BigInt']
}

export type NameUnwrapped = DomainEvent & {
  __typename?: 'NameUnwrapped'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  owner: Account
}

export type FusesSet = DomainEvent & {
  __typename?: 'FusesSet'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  fuses: Scalars['Int']
}

export type ExpiryExtended = DomainEvent & {
  __typename?: 'ExpiryExtended'
  id: Scalars['ID']
  domain: Domain
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  expiryDate: Scalars['BigInt']
}

export type Registration = {
  __typename?: 'Registration'
  id: Scalars['ID']
  domain: Domain
  registrationDate: Scalars['BigInt']
  expiryDate: Scalars['BigInt']
  cost?: Maybe<Scalars['BigInt']>
  registrant: Account
  labelName?: Maybe<Scalars['String']>
  events: Array<RegistrationEvent>
}

export type RegistrationEvent = {
  id: Scalars['ID']
  registration: Registration
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
}

export type NameRegistered = RegistrationEvent & {
  __typename?: 'NameRegistered'
  id: Scalars['ID']
  registration: Registration
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  registrant: Account
  expiryDate: Scalars['BigInt']
}

export type NameRenewed = RegistrationEvent & {
  __typename?: 'NameRenewed'
  id: Scalars['ID']
  registration: Registration
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  expiryDate: Scalars['BigInt']
}

export type NameTransferred = RegistrationEvent & {
  __typename?: 'NameTransferred'
  id: Scalars['ID']
  registration: Registration
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  newOwner: Account
}

export type WrappedDomain = {
  __typename?: 'WrappedDomain'
  id: Scalars['ID']
  domain: Domain
  expiryDate: Scalars['BigInt']
  fuses: Scalars['Int']
  owner: Account
  name?: Maybe<Scalars['String']>
}

export type Account = {
  __typename?: 'Account'
  id: Scalars['ID']
  domains: Array<Domain>
  wrappedDomains?: Maybe<Array<WrappedDomain>>
  registrations?: Maybe<Array<Registration>>
}

export type Resolver = {
  __typename?: 'Resolver'
  id: Scalars['ID']
  domain?: Maybe<Domain>
  address: Scalars['Bytes']
  addr?: Maybe<Account>
  contentHash?: Maybe<Scalars['Bytes']>
  texts?: Maybe<Array<Scalars['String']>>
  coinTypes?: Maybe<Array<Scalars['BigInt']>>
  events: Array<ResolverEvent>
}

export type ResolverEvent = {
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
}

export type AddrChanged = ResolverEvent & {
  __typename?: 'AddrChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  addr: Account
}

export type MulticoinAddrChanged = ResolverEvent & {
  __typename?: 'MulticoinAddrChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  coinType: Scalars['BigInt']
  addr: Scalars['Bytes']
}

export type NameChanged = ResolverEvent & {
  __typename?: 'NameChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  name: Scalars['String']
}

export type AbiChanged = ResolverEvent & {
  __typename?: 'AbiChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  contentType: Scalars['BigInt']
}

export type PubkeyChanged = ResolverEvent & {
  __typename?: 'PubkeyChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  x: Scalars['Bytes']
  y: Scalars['Bytes']
}

export type TextChanged = ResolverEvent & {
  __typename?: 'TextChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  key: Scalars['String']
  value?: Maybe<Scalars['String']>
}

export type ContenthashChanged = ResolverEvent & {
  __typename?: 'ContenthashChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  hash: Scalars['Bytes']
}

export type InterfaceChanged = ResolverEvent & {
  __typename?: 'InterfaceChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  interfaceID: Scalars['Bytes']
  implementer: Scalars['Bytes']
}

export type AuthorisationChanged = ResolverEvent & {
  __typename?: 'AuthorisationChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  owner: Scalars['Bytes']
  target: Scalars['Bytes']
  isAuthorized: Scalars['Boolean']
}

export type VersionChanged = ResolverEvent & {
  __typename?: 'VersionChanged'
  id: Scalars['ID']
  resolver: Resolver
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
  version: Scalars['BigInt']
}
