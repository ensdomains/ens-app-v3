/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'
import type { InputMaybe, Scalars } from './types.js'
import type { Name } from './utils.js'
import { GRACE_PERIOD_SECONDS } from '../../utils/consts.js'

export type BlockChangedFilter = {
  number_gte: Scalars['Int']
}

export type DomainFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  name?: InputMaybe<Scalars['String']>
  name_not?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_lt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_contains?: InputMaybe<Scalars['String']>
  name_contains_nocase?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_contains_nocase?: InputMaybe<Scalars['String']>
  name_starts_with?: InputMaybe<Scalars['String']>
  name_starts_with_nocase?: InputMaybe<Scalars['String']>
  name_not_starts_with?: InputMaybe<Scalars['String']>
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  name_ends_with?: InputMaybe<Scalars['String']>
  name_ends_with_nocase?: InputMaybe<Scalars['String']>
  name_not_ends_with?: InputMaybe<Scalars['String']>
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  labelName?: InputMaybe<Scalars['String']>
  labelName_not?: InputMaybe<Scalars['String']>
  labelName_gt?: InputMaybe<Scalars['String']>
  labelName_lt?: InputMaybe<Scalars['String']>
  labelName_gte?: InputMaybe<Scalars['String']>
  labelName_lte?: InputMaybe<Scalars['String']>
  labelName_in?: InputMaybe<Array<Scalars['String']>>
  labelName_not_in?: InputMaybe<Array<Scalars['String']>>
  labelName_contains?: InputMaybe<Scalars['String']>
  labelName_contains_nocase?: InputMaybe<Scalars['String']>
  labelName_not_contains?: InputMaybe<Scalars['String']>
  labelName_not_contains_nocase?: InputMaybe<Scalars['String']>
  labelName_starts_with?: InputMaybe<Scalars['String']>
  labelName_starts_with_nocase?: InputMaybe<Scalars['String']>
  labelName_not_starts_with?: InputMaybe<Scalars['String']>
  labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  labelName_ends_with?: InputMaybe<Scalars['String']>
  labelName_ends_with_nocase?: InputMaybe<Scalars['String']>
  labelName_not_ends_with?: InputMaybe<Scalars['String']>
  labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  labelhash?: InputMaybe<Scalars['Bytes']>
  labelhash_not?: InputMaybe<Scalars['Bytes']>
  labelhash_gt?: InputMaybe<Scalars['Bytes']>
  labelhash_lt?: InputMaybe<Scalars['Bytes']>
  labelhash_gte?: InputMaybe<Scalars['Bytes']>
  labelhash_lte?: InputMaybe<Scalars['Bytes']>
  labelhash_in?: InputMaybe<Array<Scalars['Bytes']>>
  labelhash_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  labelhash_contains?: InputMaybe<Scalars['Bytes']>
  labelhash_not_contains?: InputMaybe<Scalars['Bytes']>
  parent?: InputMaybe<Scalars['String']>
  parent_not?: InputMaybe<Scalars['String']>
  parent_gt?: InputMaybe<Scalars['String']>
  parent_lt?: InputMaybe<Scalars['String']>
  parent_gte?: InputMaybe<Scalars['String']>
  parent_lte?: InputMaybe<Scalars['String']>
  parent_in?: InputMaybe<Array<Scalars['String']>>
  parent_not_in?: InputMaybe<Array<Scalars['String']>>
  parent_contains?: InputMaybe<Scalars['String']>
  parent_contains_nocase?: InputMaybe<Scalars['String']>
  parent_not_contains?: InputMaybe<Scalars['String']>
  parent_not_contains_nocase?: InputMaybe<Scalars['String']>
  parent_starts_with?: InputMaybe<Scalars['String']>
  parent_starts_with_nocase?: InputMaybe<Scalars['String']>
  parent_not_starts_with?: InputMaybe<Scalars['String']>
  parent_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  parent_ends_with?: InputMaybe<Scalars['String']>
  parent_ends_with_nocase?: InputMaybe<Scalars['String']>
  parent_not_ends_with?: InputMaybe<Scalars['String']>
  parent_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  parent_?: InputMaybe<DomainFilter>
  subdomains_?: InputMaybe<DomainFilter>
  subdomainCount?: InputMaybe<Scalars['Int']>
  subdomainCount_not?: InputMaybe<Scalars['Int']>
  subdomainCount_gt?: InputMaybe<Scalars['Int']>
  subdomainCount_lt?: InputMaybe<Scalars['Int']>
  subdomainCount_gte?: InputMaybe<Scalars['Int']>
  subdomainCount_lte?: InputMaybe<Scalars['Int']>
  subdomainCount_in?: InputMaybe<Array<Scalars['Int']>>
  subdomainCount_not_in?: InputMaybe<Array<Scalars['Int']>>
  resolvedAddress?: InputMaybe<Scalars['String']>
  resolvedAddress_not?: InputMaybe<Scalars['String']>
  resolvedAddress_gt?: InputMaybe<Scalars['String']>
  resolvedAddress_lt?: InputMaybe<Scalars['String']>
  resolvedAddress_gte?: InputMaybe<Scalars['String']>
  resolvedAddress_lte?: InputMaybe<Scalars['String']>
  resolvedAddress_in?: InputMaybe<Array<Scalars['String']>>
  resolvedAddress_not_in?: InputMaybe<Array<Scalars['String']>>
  resolvedAddress_contains?: InputMaybe<Scalars['String']>
  resolvedAddress_contains_nocase?: InputMaybe<Scalars['String']>
  resolvedAddress_not_contains?: InputMaybe<Scalars['String']>
  resolvedAddress_not_contains_nocase?: InputMaybe<Scalars['String']>
  resolvedAddress_starts_with?: InputMaybe<Scalars['String']>
  resolvedAddress_starts_with_nocase?: InputMaybe<Scalars['String']>
  resolvedAddress_not_starts_with?: InputMaybe<Scalars['String']>
  resolvedAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  resolvedAddress_ends_with?: InputMaybe<Scalars['String']>
  resolvedAddress_ends_with_nocase?: InputMaybe<Scalars['String']>
  resolvedAddress_not_ends_with?: InputMaybe<Scalars['String']>
  resolvedAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  resolvedAddress_?: InputMaybe<AccountFilter>
  resolver?: InputMaybe<Scalars['String']>
  resolver_not?: InputMaybe<Scalars['String']>
  resolver_gt?: InputMaybe<Scalars['String']>
  resolver_lt?: InputMaybe<Scalars['String']>
  resolver_gte?: InputMaybe<Scalars['String']>
  resolver_lte?: InputMaybe<Scalars['String']>
  resolver_in?: InputMaybe<Array<Scalars['String']>>
  resolver_not_in?: InputMaybe<Array<Scalars['String']>>
  resolver_contains?: InputMaybe<Scalars['String']>
  resolver_contains_nocase?: InputMaybe<Scalars['String']>
  resolver_not_contains?: InputMaybe<Scalars['String']>
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
  resolver_starts_with?: InputMaybe<Scalars['String']>
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
  resolver_not_starts_with?: InputMaybe<Scalars['String']>
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  resolver_ends_with?: InputMaybe<Scalars['String']>
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
  resolver_not_ends_with?: InputMaybe<Scalars['String']>
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  resolver_?: InputMaybe<ResolverFilter>
  ttl?: InputMaybe<Scalars['BigInt']>
  ttl_not?: InputMaybe<Scalars['BigInt']>
  ttl_gt?: InputMaybe<Scalars['BigInt']>
  ttl_lt?: InputMaybe<Scalars['BigInt']>
  ttl_gte?: InputMaybe<Scalars['BigInt']>
  ttl_lte?: InputMaybe<Scalars['BigInt']>
  ttl_in?: InputMaybe<Array<Scalars['BigInt']>>
  ttl_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  isMigrated?: InputMaybe<Scalars['Boolean']>
  isMigrated_not?: InputMaybe<Scalars['Boolean']>
  isMigrated_in?: InputMaybe<Array<Scalars['Boolean']>>
  isMigrated_not_in?: InputMaybe<Array<Scalars['Boolean']>>
  createdAt?: InputMaybe<Scalars['BigInt']>
  createdAt_not?: InputMaybe<Scalars['BigInt']>
  createdAt_gt?: InputMaybe<Scalars['BigInt']>
  createdAt_lt?: InputMaybe<Scalars['BigInt']>
  createdAt_gte?: InputMaybe<Scalars['BigInt']>
  createdAt_lte?: InputMaybe<Scalars['BigInt']>
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  owner?: InputMaybe<Scalars['String']>
  owner_not?: InputMaybe<Scalars['String']>
  owner_gt?: InputMaybe<Scalars['String']>
  owner_lt?: InputMaybe<Scalars['String']>
  owner_gte?: InputMaybe<Scalars['String']>
  owner_lte?: InputMaybe<Scalars['String']>
  owner_in?: InputMaybe<Array<Scalars['String']>>
  owner_not_in?: InputMaybe<Array<Scalars['String']>>
  owner_contains?: InputMaybe<Scalars['String']>
  owner_contains_nocase?: InputMaybe<Scalars['String']>
  owner_not_contains?: InputMaybe<Scalars['String']>
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>
  owner_starts_with?: InputMaybe<Scalars['String']>
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>
  owner_not_starts_with?: InputMaybe<Scalars['String']>
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  owner_ends_with?: InputMaybe<Scalars['String']>
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>
  owner_not_ends_with?: InputMaybe<Scalars['String']>
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  owner_?: InputMaybe<AccountFilter>
  registrant?: InputMaybe<Scalars['String']>
  registrant_not?: InputMaybe<Scalars['String']>
  registrant_gt?: InputMaybe<Scalars['String']>
  registrant_lt?: InputMaybe<Scalars['String']>
  registrant_gte?: InputMaybe<Scalars['String']>
  registrant_lte?: InputMaybe<Scalars['String']>
  registrant_in?: InputMaybe<Array<Scalars['String']>>
  registrant_not_in?: InputMaybe<Array<Scalars['String']>>
  registrant_contains?: InputMaybe<Scalars['String']>
  registrant_contains_nocase?: InputMaybe<Scalars['String']>
  registrant_not_contains?: InputMaybe<Scalars['String']>
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']>
  registrant_starts_with?: InputMaybe<Scalars['String']>
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']>
  registrant_not_starts_with?: InputMaybe<Scalars['String']>
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  registrant_ends_with?: InputMaybe<Scalars['String']>
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']>
  registrant_not_ends_with?: InputMaybe<Scalars['String']>
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  registrant_?: InputMaybe<AccountFilter>
  wrappedOwner?: InputMaybe<Scalars['String']>
  wrappedOwner_not?: InputMaybe<Scalars['String']>
  wrappedOwner_gt?: InputMaybe<Scalars['String']>
  wrappedOwner_lt?: InputMaybe<Scalars['String']>
  wrappedOwner_gte?: InputMaybe<Scalars['String']>
  wrappedOwner_lte?: InputMaybe<Scalars['String']>
  wrappedOwner_in?: InputMaybe<Array<Scalars['String']>>
  wrappedOwner_not_in?: InputMaybe<Array<Scalars['String']>>
  wrappedOwner_contains?: InputMaybe<Scalars['String']>
  wrappedOwner_contains_nocase?: InputMaybe<Scalars['String']>
  wrappedOwner_not_contains?: InputMaybe<Scalars['String']>
  wrappedOwner_not_contains_nocase?: InputMaybe<Scalars['String']>
  wrappedOwner_starts_with?: InputMaybe<Scalars['String']>
  wrappedOwner_starts_with_nocase?: InputMaybe<Scalars['String']>
  wrappedOwner_not_starts_with?: InputMaybe<Scalars['String']>
  wrappedOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  wrappedOwner_ends_with?: InputMaybe<Scalars['String']>
  wrappedOwner_ends_with_nocase?: InputMaybe<Scalars['String']>
  wrappedOwner_not_ends_with?: InputMaybe<Scalars['String']>
  wrappedOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  wrappedOwner_?: InputMaybe<AccountFilter>
  expiryDate?: InputMaybe<Scalars['BigInt']>
  expiryDate_not?: InputMaybe<Scalars['BigInt']>
  expiryDate_gt?: InputMaybe<Scalars['BigInt']>
  expiryDate_lt?: InputMaybe<Scalars['BigInt']>
  expiryDate_gte?: InputMaybe<Scalars['BigInt']>
  expiryDate_lte?: InputMaybe<Scalars['BigInt']>
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  registration_?: InputMaybe<RegistrationFilter>
  wrappedDomain_?: InputMaybe<WrappedDomainFilter>
  events_?: InputMaybe<DomainEventFilter>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<DomainFilter>>>
  or?: InputMaybe<Array<InputMaybe<DomainFilter>>>
}

export type DomainEventFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  domain?: InputMaybe<Scalars['String']>
  domain_not?: InputMaybe<Scalars['String']>
  domain_gt?: InputMaybe<Scalars['String']>
  domain_lt?: InputMaybe<Scalars['String']>
  domain_gte?: InputMaybe<Scalars['String']>
  domain_lte?: InputMaybe<Scalars['String']>
  domain_in?: InputMaybe<Array<Scalars['String']>>
  domain_not_in?: InputMaybe<Array<Scalars['String']>>
  domain_contains?: InputMaybe<Scalars['String']>
  domain_contains_nocase?: InputMaybe<Scalars['String']>
  domain_not_contains?: InputMaybe<Scalars['String']>
  domain_not_contains_nocase?: InputMaybe<Scalars['String']>
  domain_starts_with?: InputMaybe<Scalars['String']>
  domain_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_starts_with?: InputMaybe<Scalars['String']>
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_ends_with?: InputMaybe<Scalars['String']>
  domain_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_ends_with?: InputMaybe<Scalars['String']>
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_?: InputMaybe<DomainFilter>
  blockNumber?: InputMaybe<Scalars['Int']>
  blockNumber_not?: InputMaybe<Scalars['Int']>
  blockNumber_gt?: InputMaybe<Scalars['Int']>
  blockNumber_lt?: InputMaybe<Scalars['Int']>
  blockNumber_gte?: InputMaybe<Scalars['Int']>
  blockNumber_lte?: InputMaybe<Scalars['Int']>
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
  transactionID?: InputMaybe<Scalars['Bytes']>
  transactionID_not?: InputMaybe<Scalars['Bytes']>
  transactionID_gt?: InputMaybe<Scalars['Bytes']>
  transactionID_lt?: InputMaybe<Scalars['Bytes']>
  transactionID_gte?: InputMaybe<Scalars['Bytes']>
  transactionID_lte?: InputMaybe<Scalars['Bytes']>
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  transactionID_contains?: InputMaybe<Scalars['Bytes']>
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<DomainEventFilter>>>
  or?: InputMaybe<Array<InputMaybe<DomainEventFilter>>>
}

export type RegistrationFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  domain?: InputMaybe<Scalars['String']>
  domain_not?: InputMaybe<Scalars['String']>
  domain_gt?: InputMaybe<Scalars['String']>
  domain_lt?: InputMaybe<Scalars['String']>
  domain_gte?: InputMaybe<Scalars['String']>
  domain_lte?: InputMaybe<Scalars['String']>
  domain_in?: InputMaybe<Array<Scalars['String']>>
  domain_not_in?: InputMaybe<Array<Scalars['String']>>
  domain_contains?: InputMaybe<Scalars['String']>
  domain_contains_nocase?: InputMaybe<Scalars['String']>
  domain_not_contains?: InputMaybe<Scalars['String']>
  domain_not_contains_nocase?: InputMaybe<Scalars['String']>
  domain_starts_with?: InputMaybe<Scalars['String']>
  domain_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_starts_with?: InputMaybe<Scalars['String']>
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_ends_with?: InputMaybe<Scalars['String']>
  domain_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_ends_with?: InputMaybe<Scalars['String']>
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_?: InputMaybe<DomainFilter>
  registrationDate?: InputMaybe<Scalars['BigInt']>
  registrationDate_not?: InputMaybe<Scalars['BigInt']>
  registrationDate_gt?: InputMaybe<Scalars['BigInt']>
  registrationDate_lt?: InputMaybe<Scalars['BigInt']>
  registrationDate_gte?: InputMaybe<Scalars['BigInt']>
  registrationDate_lte?: InputMaybe<Scalars['BigInt']>
  registrationDate_in?: InputMaybe<Array<Scalars['BigInt']>>
  registrationDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  expiryDate?: InputMaybe<Scalars['BigInt']>
  expiryDate_not?: InputMaybe<Scalars['BigInt']>
  expiryDate_gt?: InputMaybe<Scalars['BigInt']>
  expiryDate_lt?: InputMaybe<Scalars['BigInt']>
  expiryDate_gte?: InputMaybe<Scalars['BigInt']>
  expiryDate_lte?: InputMaybe<Scalars['BigInt']>
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  cost?: InputMaybe<Scalars['BigInt']>
  cost_not?: InputMaybe<Scalars['BigInt']>
  cost_gt?: InputMaybe<Scalars['BigInt']>
  cost_lt?: InputMaybe<Scalars['BigInt']>
  cost_gte?: InputMaybe<Scalars['BigInt']>
  cost_lte?: InputMaybe<Scalars['BigInt']>
  cost_in?: InputMaybe<Array<Scalars['BigInt']>>
  cost_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  registrant?: InputMaybe<Scalars['String']>
  registrant_not?: InputMaybe<Scalars['String']>
  registrant_gt?: InputMaybe<Scalars['String']>
  registrant_lt?: InputMaybe<Scalars['String']>
  registrant_gte?: InputMaybe<Scalars['String']>
  registrant_lte?: InputMaybe<Scalars['String']>
  registrant_in?: InputMaybe<Array<Scalars['String']>>
  registrant_not_in?: InputMaybe<Array<Scalars['String']>>
  registrant_contains?: InputMaybe<Scalars['String']>
  registrant_contains_nocase?: InputMaybe<Scalars['String']>
  registrant_not_contains?: InputMaybe<Scalars['String']>
  registrant_not_contains_nocase?: InputMaybe<Scalars['String']>
  registrant_starts_with?: InputMaybe<Scalars['String']>
  registrant_starts_with_nocase?: InputMaybe<Scalars['String']>
  registrant_not_starts_with?: InputMaybe<Scalars['String']>
  registrant_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  registrant_ends_with?: InputMaybe<Scalars['String']>
  registrant_ends_with_nocase?: InputMaybe<Scalars['String']>
  registrant_not_ends_with?: InputMaybe<Scalars['String']>
  registrant_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  registrant_?: InputMaybe<AccountFilter>
  labelName?: InputMaybe<Scalars['String']>
  labelName_not?: InputMaybe<Scalars['String']>
  labelName_gt?: InputMaybe<Scalars['String']>
  labelName_lt?: InputMaybe<Scalars['String']>
  labelName_gte?: InputMaybe<Scalars['String']>
  labelName_lte?: InputMaybe<Scalars['String']>
  labelName_in?: InputMaybe<Array<Scalars['String']>>
  labelName_not_in?: InputMaybe<Array<Scalars['String']>>
  labelName_contains?: InputMaybe<Scalars['String']>
  labelName_contains_nocase?: InputMaybe<Scalars['String']>
  labelName_not_contains?: InputMaybe<Scalars['String']>
  labelName_not_contains_nocase?: InputMaybe<Scalars['String']>
  labelName_starts_with?: InputMaybe<Scalars['String']>
  labelName_starts_with_nocase?: InputMaybe<Scalars['String']>
  labelName_not_starts_with?: InputMaybe<Scalars['String']>
  labelName_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  labelName_ends_with?: InputMaybe<Scalars['String']>
  labelName_ends_with_nocase?: InputMaybe<Scalars['String']>
  labelName_not_ends_with?: InputMaybe<Scalars['String']>
  labelName_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  events_?: InputMaybe<RegistrationEventFilter>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<RegistrationFilter>>>
  or?: InputMaybe<Array<InputMaybe<RegistrationFilter>>>
}

export type RegistrationEventFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  registration?: InputMaybe<Scalars['String']>
  registration_not?: InputMaybe<Scalars['String']>
  registration_gt?: InputMaybe<Scalars['String']>
  registration_lt?: InputMaybe<Scalars['String']>
  registration_gte?: InputMaybe<Scalars['String']>
  registration_lte?: InputMaybe<Scalars['String']>
  registration_in?: InputMaybe<Array<Scalars['String']>>
  registration_not_in?: InputMaybe<Array<Scalars['String']>>
  registration_contains?: InputMaybe<Scalars['String']>
  registration_contains_nocase?: InputMaybe<Scalars['String']>
  registration_not_contains?: InputMaybe<Scalars['String']>
  registration_not_contains_nocase?: InputMaybe<Scalars['String']>
  registration_starts_with?: InputMaybe<Scalars['String']>
  registration_starts_with_nocase?: InputMaybe<Scalars['String']>
  registration_not_starts_with?: InputMaybe<Scalars['String']>
  registration_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  registration_ends_with?: InputMaybe<Scalars['String']>
  registration_ends_with_nocase?: InputMaybe<Scalars['String']>
  registration_not_ends_with?: InputMaybe<Scalars['String']>
  registration_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  registration_?: InputMaybe<RegistrationFilter>
  blockNumber?: InputMaybe<Scalars['Int']>
  blockNumber_not?: InputMaybe<Scalars['Int']>
  blockNumber_gt?: InputMaybe<Scalars['Int']>
  blockNumber_lt?: InputMaybe<Scalars['Int']>
  blockNumber_gte?: InputMaybe<Scalars['Int']>
  blockNumber_lte?: InputMaybe<Scalars['Int']>
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
  transactionID?: InputMaybe<Scalars['Bytes']>
  transactionID_not?: InputMaybe<Scalars['Bytes']>
  transactionID_gt?: InputMaybe<Scalars['Bytes']>
  transactionID_lt?: InputMaybe<Scalars['Bytes']>
  transactionID_gte?: InputMaybe<Scalars['Bytes']>
  transactionID_lte?: InputMaybe<Scalars['Bytes']>
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  transactionID_contains?: InputMaybe<Scalars['Bytes']>
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<RegistrationEventFilter>>>
  or?: InputMaybe<Array<InputMaybe<RegistrationEventFilter>>>
}

export type WrappedDomainFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  domain?: InputMaybe<Scalars['String']>
  domain_not?: InputMaybe<Scalars['String']>
  domain_gt?: InputMaybe<Scalars['String']>
  domain_lt?: InputMaybe<Scalars['String']>
  domain_gte?: InputMaybe<Scalars['String']>
  domain_lte?: InputMaybe<Scalars['String']>
  domain_in?: InputMaybe<Array<Scalars['String']>>
  domain_not_in?: InputMaybe<Array<Scalars['String']>>
  domain_contains?: InputMaybe<Scalars['String']>
  domain_contains_nocase?: InputMaybe<Scalars['String']>
  domain_not_contains?: InputMaybe<Scalars['String']>
  domain_not_contains_nocase?: InputMaybe<Scalars['String']>
  domain_starts_with?: InputMaybe<Scalars['String']>
  domain_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_starts_with?: InputMaybe<Scalars['String']>
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_ends_with?: InputMaybe<Scalars['String']>
  domain_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_ends_with?: InputMaybe<Scalars['String']>
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_?: InputMaybe<DomainFilter>
  expiryDate?: InputMaybe<Scalars['BigInt']>
  expiryDate_not?: InputMaybe<Scalars['BigInt']>
  expiryDate_gt?: InputMaybe<Scalars['BigInt']>
  expiryDate_lt?: InputMaybe<Scalars['BigInt']>
  expiryDate_gte?: InputMaybe<Scalars['BigInt']>
  expiryDate_lte?: InputMaybe<Scalars['BigInt']>
  expiryDate_in?: InputMaybe<Array<Scalars['BigInt']>>
  expiryDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>
  fuses?: InputMaybe<Scalars['Int']>
  fuses_not?: InputMaybe<Scalars['Int']>
  fuses_gt?: InputMaybe<Scalars['Int']>
  fuses_lt?: InputMaybe<Scalars['Int']>
  fuses_gte?: InputMaybe<Scalars['Int']>
  fuses_lte?: InputMaybe<Scalars['Int']>
  fuses_in?: InputMaybe<Array<Scalars['Int']>>
  fuses_not_in?: InputMaybe<Array<Scalars['Int']>>
  owner?: InputMaybe<Scalars['String']>
  owner_not?: InputMaybe<Scalars['String']>
  owner_gt?: InputMaybe<Scalars['String']>
  owner_lt?: InputMaybe<Scalars['String']>
  owner_gte?: InputMaybe<Scalars['String']>
  owner_lte?: InputMaybe<Scalars['String']>
  owner_in?: InputMaybe<Array<Scalars['String']>>
  owner_not_in?: InputMaybe<Array<Scalars['String']>>
  owner_contains?: InputMaybe<Scalars['String']>
  owner_contains_nocase?: InputMaybe<Scalars['String']>
  owner_not_contains?: InputMaybe<Scalars['String']>
  owner_not_contains_nocase?: InputMaybe<Scalars['String']>
  owner_starts_with?: InputMaybe<Scalars['String']>
  owner_starts_with_nocase?: InputMaybe<Scalars['String']>
  owner_not_starts_with?: InputMaybe<Scalars['String']>
  owner_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  owner_ends_with?: InputMaybe<Scalars['String']>
  owner_ends_with_nocase?: InputMaybe<Scalars['String']>
  owner_not_ends_with?: InputMaybe<Scalars['String']>
  owner_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  owner_?: InputMaybe<AccountFilter>
  name?: InputMaybe<Scalars['String']>
  name_not?: InputMaybe<Scalars['String']>
  name_gt?: InputMaybe<Scalars['String']>
  name_lt?: InputMaybe<Scalars['String']>
  name_gte?: InputMaybe<Scalars['String']>
  name_lte?: InputMaybe<Scalars['String']>
  name_in?: InputMaybe<Array<Scalars['String']>>
  name_not_in?: InputMaybe<Array<Scalars['String']>>
  name_contains?: InputMaybe<Scalars['String']>
  name_contains_nocase?: InputMaybe<Scalars['String']>
  name_not_contains?: InputMaybe<Scalars['String']>
  name_not_contains_nocase?: InputMaybe<Scalars['String']>
  name_starts_with?: InputMaybe<Scalars['String']>
  name_starts_with_nocase?: InputMaybe<Scalars['String']>
  name_not_starts_with?: InputMaybe<Scalars['String']>
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  name_ends_with?: InputMaybe<Scalars['String']>
  name_ends_with_nocase?: InputMaybe<Scalars['String']>
  name_not_ends_with?: InputMaybe<Scalars['String']>
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<WrappedDomainFilter>>>
  or?: InputMaybe<Array<InputMaybe<WrappedDomainFilter>>>
}

export type AccountFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  domains_?: InputMaybe<DomainFilter>
  wrappedDomains_?: InputMaybe<WrappedDomainFilter>
  registrations_?: InputMaybe<RegistrationFilter>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<AccountFilter>>>
  or?: InputMaybe<Array<InputMaybe<AccountFilter>>>
}

export type ResolverFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  domain?: InputMaybe<Scalars['String']>
  domain_not?: InputMaybe<Scalars['String']>
  domain_gt?: InputMaybe<Scalars['String']>
  domain_lt?: InputMaybe<Scalars['String']>
  domain_gte?: InputMaybe<Scalars['String']>
  domain_lte?: InputMaybe<Scalars['String']>
  domain_in?: InputMaybe<Array<Scalars['String']>>
  domain_not_in?: InputMaybe<Array<Scalars['String']>>
  domain_contains?: InputMaybe<Scalars['String']>
  domain_contains_nocase?: InputMaybe<Scalars['String']>
  domain_not_contains?: InputMaybe<Scalars['String']>
  domain_not_contains_nocase?: InputMaybe<Scalars['String']>
  domain_starts_with?: InputMaybe<Scalars['String']>
  domain_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_starts_with?: InputMaybe<Scalars['String']>
  domain_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  domain_ends_with?: InputMaybe<Scalars['String']>
  domain_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_not_ends_with?: InputMaybe<Scalars['String']>
  domain_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  domain_?: InputMaybe<DomainFilter>
  address?: InputMaybe<Scalars['Bytes']>
  address_not?: InputMaybe<Scalars['Bytes']>
  address_gt?: InputMaybe<Scalars['Bytes']>
  address_lt?: InputMaybe<Scalars['Bytes']>
  address_gte?: InputMaybe<Scalars['Bytes']>
  address_lte?: InputMaybe<Scalars['Bytes']>
  address_in?: InputMaybe<Array<Scalars['Bytes']>>
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  address_contains?: InputMaybe<Scalars['Bytes']>
  address_not_contains?: InputMaybe<Scalars['Bytes']>
  addr?: InputMaybe<Scalars['String']>
  addr_not?: InputMaybe<Scalars['String']>
  addr_gt?: InputMaybe<Scalars['String']>
  addr_lt?: InputMaybe<Scalars['String']>
  addr_gte?: InputMaybe<Scalars['String']>
  addr_lte?: InputMaybe<Scalars['String']>
  addr_in?: InputMaybe<Array<Scalars['String']>>
  addr_not_in?: InputMaybe<Array<Scalars['String']>>
  addr_contains?: InputMaybe<Scalars['String']>
  addr_contains_nocase?: InputMaybe<Scalars['String']>
  addr_not_contains?: InputMaybe<Scalars['String']>
  addr_not_contains_nocase?: InputMaybe<Scalars['String']>
  addr_starts_with?: InputMaybe<Scalars['String']>
  addr_starts_with_nocase?: InputMaybe<Scalars['String']>
  addr_not_starts_with?: InputMaybe<Scalars['String']>
  addr_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  addr_ends_with?: InputMaybe<Scalars['String']>
  addr_ends_with_nocase?: InputMaybe<Scalars['String']>
  addr_not_ends_with?: InputMaybe<Scalars['String']>
  addr_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  addr_?: InputMaybe<AccountFilter>
  contentHash?: InputMaybe<Scalars['Bytes']>
  contentHash_not?: InputMaybe<Scalars['Bytes']>
  contentHash_gt?: InputMaybe<Scalars['Bytes']>
  contentHash_lt?: InputMaybe<Scalars['Bytes']>
  contentHash_gte?: InputMaybe<Scalars['Bytes']>
  contentHash_lte?: InputMaybe<Scalars['Bytes']>
  contentHash_in?: InputMaybe<Array<Scalars['Bytes']>>
  contentHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  contentHash_contains?: InputMaybe<Scalars['Bytes']>
  contentHash_not_contains?: InputMaybe<Scalars['Bytes']>
  texts?: InputMaybe<Array<Scalars['String']>>
  texts_not?: InputMaybe<Array<Scalars['String']>>
  texts_contains?: InputMaybe<Array<Scalars['String']>>
  texts_contains_nocase?: InputMaybe<Array<Scalars['String']>>
  texts_not_contains?: InputMaybe<Array<Scalars['String']>>
  texts_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>
  coinTypes?: InputMaybe<Array<Scalars['BigInt']>>
  coinTypes_not?: InputMaybe<Array<Scalars['BigInt']>>
  coinTypes_contains?: InputMaybe<Array<Scalars['BigInt']>>
  coinTypes_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>
  coinTypes_not_contains?: InputMaybe<Array<Scalars['BigInt']>>
  coinTypes_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']>>
  events_?: InputMaybe<ResolverEventFilter>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<ResolverFilter>>>
  or?: InputMaybe<Array<InputMaybe<ResolverFilter>>>
}

export type ResolverEventFilter = {
  id?: InputMaybe<Scalars['ID']>
  id_not?: InputMaybe<Scalars['ID']>
  id_gt?: InputMaybe<Scalars['ID']>
  id_lt?: InputMaybe<Scalars['ID']>
  id_gte?: InputMaybe<Scalars['ID']>
  id_lte?: InputMaybe<Scalars['ID']>
  id_in?: InputMaybe<Array<Scalars['ID']>>
  id_not_in?: InputMaybe<Array<Scalars['ID']>>
  resolver?: InputMaybe<Scalars['String']>
  resolver_not?: InputMaybe<Scalars['String']>
  resolver_gt?: InputMaybe<Scalars['String']>
  resolver_lt?: InputMaybe<Scalars['String']>
  resolver_gte?: InputMaybe<Scalars['String']>
  resolver_lte?: InputMaybe<Scalars['String']>
  resolver_in?: InputMaybe<Array<Scalars['String']>>
  resolver_not_in?: InputMaybe<Array<Scalars['String']>>
  resolver_contains?: InputMaybe<Scalars['String']>
  resolver_contains_nocase?: InputMaybe<Scalars['String']>
  resolver_not_contains?: InputMaybe<Scalars['String']>
  resolver_not_contains_nocase?: InputMaybe<Scalars['String']>
  resolver_starts_with?: InputMaybe<Scalars['String']>
  resolver_starts_with_nocase?: InputMaybe<Scalars['String']>
  resolver_not_starts_with?: InputMaybe<Scalars['String']>
  resolver_not_starts_with_nocase?: InputMaybe<Scalars['String']>
  resolver_ends_with?: InputMaybe<Scalars['String']>
  resolver_ends_with_nocase?: InputMaybe<Scalars['String']>
  resolver_not_ends_with?: InputMaybe<Scalars['String']>
  resolver_not_ends_with_nocase?: InputMaybe<Scalars['String']>
  resolver_?: InputMaybe<ResolverFilter>
  blockNumber?: InputMaybe<Scalars['Int']>
  blockNumber_not?: InputMaybe<Scalars['Int']>
  blockNumber_gt?: InputMaybe<Scalars['Int']>
  blockNumber_lt?: InputMaybe<Scalars['Int']>
  blockNumber_gte?: InputMaybe<Scalars['Int']>
  blockNumber_lte?: InputMaybe<Scalars['Int']>
  blockNumber_in?: InputMaybe<Array<Scalars['Int']>>
  blockNumber_not_in?: InputMaybe<Array<Scalars['Int']>>
  transactionID?: InputMaybe<Scalars['Bytes']>
  transactionID_not?: InputMaybe<Scalars['Bytes']>
  transactionID_gt?: InputMaybe<Scalars['Bytes']>
  transactionID_lt?: InputMaybe<Scalars['Bytes']>
  transactionID_gte?: InputMaybe<Scalars['Bytes']>
  transactionID_lte?: InputMaybe<Scalars['Bytes']>
  transactionID_in?: InputMaybe<Array<Scalars['Bytes']>>
  transactionID_not_in?: InputMaybe<Array<Scalars['Bytes']>>
  transactionID_contains?: InputMaybe<Scalars['Bytes']>
  transactionID_not_contains?: InputMaybe<Scalars['Bytes']>
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<ResolverEventFilter>>>
  or?: InputMaybe<Array<InputMaybe<ResolverEventFilter>>>
}

export const getExpiryDateOrderFilter = ({
  orderDirection,
  lastDomain,
}: {
  orderDirection: 'asc' | 'desc'
  lastDomain: Name
}): DomainFilter => {
  let lastExpiryDate = lastDomain.expiryDate?.value
    ? lastDomain.expiryDate.value / 1000
    : 0
  if (lastDomain.parentName === 'eth') lastExpiryDate += GRACE_PERIOD_SECONDS

  return match({
    lastExpiryDate,
    orderDirection,
  })
    .with(
      {
        lastExpiryDate: P.number.lte(0),
        orderDirection: 'asc',
      },
      () =>
        ({
          and: [{ expiryDate: null }, { id_gt: lastDomain.id }],
        } as DomainFilter),
    )
    .with(
      {
        lastExpiryDate: P.number,
        orderDirection: 'asc',
      },
      () =>
        ({
          or: [
            {
              and: [
                {
                  expiryDate_gte: `${lastExpiryDate}`,
                },
                { id_gt: lastDomain.id },
              ],
            },
            {
              expiryDate_gt: `${lastExpiryDate}`,
            },
            {
              expiryDate: null,
            },
          ],
        } as DomainFilter),
    )
    .with(
      {
        lastExpiryDate: P.number.lte(0),
        orderDirection: 'desc',
      },
      () =>
        ({
          or: [
            {
              and: [{ expiryDate: null }, { [`id_lt`]: lastDomain.id }],
            },
            {
              [`expiryDate_gt`]: 0,
            },
          ],
        } as DomainFilter),
    )
    .with(
      {
        lastExpiryDate: P.number,
        orderDirection: 'desc',
      },
      () =>
        ({
          or: [
            {
              and: [
                { expiryDate_lte: `${lastExpiryDate}` },
                { id_lt: lastDomain.id },
              ],
            },
            {
              expiryDate_lt: `${lastExpiryDate}`,
            },
          ],
        } as DomainFilter),
    )
    .exhaustive()
}

export const getCreatedAtOrderFilter = ({
  orderDirection,
  lastDomain,
}: {
  orderDirection: 'asc' | 'desc'
  lastDomain: Name
}): DomainFilter =>
  match({
    orderDirection,
  })
    .with(
      {
        orderDirection: 'asc',
      },
      () =>
        ({
          or: [
            {
              and: [
                {
                  createdAt_gte: `${lastDomain.createdAt.value / 1000}`,
                  id_gt: lastDomain.id,
                },
              ],
            },
            {
              createdAt_gt: `${lastDomain.createdAt.value / 1000}`,
            },
          ],
        } as DomainFilter),
    )
    .with(
      {
        orderDirection: 'desc',
      },
      () =>
        ({
          or: [
            {
              and: [
                { createdAt_lte: `${lastDomain.createdAt.value / 1000}` },
                { id_lt: lastDomain.id },
              ],
            },
            {
              createdAt_lt: `${lastDomain.createdAt.value / 1000}`,
            },
          ],
        } as DomainFilter),
    )
    .exhaustive()
