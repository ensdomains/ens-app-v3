import type { Address, Hex } from 'viem'

export type DomainEventKey =
  | 'NewOwner'
  | 'NewResolver'
  | 'Transfer'
  | 'NewTTL'
  | 'WrappedTransfer'
  | 'NameWrapped'
  | 'NameUnwrapped'
  | 'FusesSet'
  | 'ExpiryExtended'
export type RegistrationEventKey =
  | 'NameRegistered'
  | 'NameRenewed'
  | 'NameTransferred'
export type ResolverEventKey =
  | 'AddrChanged'
  | 'MulticoinAddrChanged'
  | 'NameChanged'
  | 'AbiChanged'
  | 'PubkeyChanged'
  | 'TextChanged'
  | 'ContenthashChanged'
  | 'InterfaceChanged'
  | 'AuthorisationChanged'
  | 'VersionChanged'

type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Bytes: Hex
  BigInt: string
}

type Account = {
  id: Address
}

type Resolver = {
  id: Hex
}

export type BaseDomainEvent = {
  type: DomainEventKey
  id: Scalars['ID']
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
}

export type Transfer = BaseDomainEvent & {
  type: 'Transfer'
  owner: Account
}

export type NewOwner = BaseDomainEvent & {
  type: 'NewOwner'
  owner: Account
}

export type NewResolver = BaseDomainEvent & {
  type: 'NewResolver'
  resolver: Resolver
}

export type NewTtl = BaseDomainEvent & {
  type: 'NewTTL'
  ttl: Scalars['BigInt']
}

export type WrappedTransfer = BaseDomainEvent & {
  type: 'WrappedTransfer'
  owner: Account
}

export type NameWrapped = BaseDomainEvent & {
  type: 'NameWrapped'
  name: Scalars['String']
  fuses: Scalars['Int']
  owner: Account
  expiryDate: Scalars['BigInt']
}

export type NameUnwrapped = BaseDomainEvent & {
  type: 'NameUnwrapped'
  owner: Account
}

export type FusesSet = BaseDomainEvent & {
  type: 'FusesSet'
  fuses: Scalars['Int']
}

export type ExpiryExtended = BaseDomainEvent & {
  type: 'ExpiryExtended'
  expiryDate: Scalars['BigInt']
}

export type DomainEvent =
  | Transfer
  | NewOwner
  | NewResolver
  | NewTtl
  | WrappedTransfer
  | NameWrapped
  | NameUnwrapped
  | FusesSet
  | ExpiryExtended

export type BaseRegistrationEvent = {
  type: RegistrationEventKey
  id: Scalars['ID']
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
}

export type NameRegistered = BaseRegistrationEvent & {
  type: 'NameRegistered'
  registrant: Account
  expiryDate: Scalars['BigInt']
}

export type NameRenewed = BaseRegistrationEvent & {
  type: 'NameRenewed'
  expiryDate: Scalars['BigInt']
}

export type NameTransferred = BaseRegistrationEvent & {
  type: 'NameTransferred'
  newOwner: Account
}

export type RegistrationEvent = NameRegistered | NameRenewed | NameTransferred

export type BaseResolverEvent = {
  type: ResolverEventKey
  id: Scalars['ID']
  blockNumber: Scalars['Int']
  transactionID: Scalars['Bytes']
}

export type AddrChanged = BaseResolverEvent & {
  type: 'AddrChanged'
  addr: Account
}

export type MulticoinAddrChanged = BaseResolverEvent & {
  type: 'MulticoinAddrChanged'
  coinType: Scalars['BigInt']
  multiaddr: Scalars['Bytes']
}

export type NameChanged = BaseResolverEvent & {
  type: 'NameChanged'
  name: Scalars['String']
}

export type AbiChanged = BaseResolverEvent & {
  type: 'AbiChanged'
  contentType: Scalars['BigInt']
}

export type PubkeyChanged = BaseResolverEvent & {
  type: 'PubkeyChanged'
  x: Scalars['Bytes']
  y: Scalars['Bytes']
}

export type TextChanged = BaseResolverEvent & {
  type: 'TextChanged'
  key: Scalars['String']
  value?: Scalars['String'] | null
}

export type ContenthashChanged = BaseResolverEvent & {
  type: 'ContenthashChanged'
  hash: Scalars['Bytes']
}

export type InterfaceChanged = BaseResolverEvent & {
  type: 'InterfaceChanged'
  interfaceID: Scalars['Bytes']
  implementer: Scalars['Bytes']
}

export type AuthorisationChanged = BaseResolverEvent & {
  type: 'AuthorisationChanged'
  owner: Scalars['Bytes']
  target: Scalars['Bytes']
  isAuthorized: Scalars['Boolean']
}

export type VersionChanged = BaseResolverEvent & {
  type: 'VersionChanged'
  version: Scalars['BigInt']
}

export type ResolverEvent =
  | AddrChanged
  | MulticoinAddrChanged
  | NameChanged
  | AbiChanged
  | PubkeyChanged
  | TextChanged
  | ContenthashChanged
  | InterfaceChanged
  | AuthorisationChanged
  | VersionChanged
