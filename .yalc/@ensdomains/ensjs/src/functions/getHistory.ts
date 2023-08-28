import { formatsByCoinType } from '@ensdomains/address-encoder'
import { hexStripZeros } from '@ethersproject/bytes'
import { ENSArgs } from '..'
import { decodeContenthash } from '../utils/contentHash'
import {
  debugSubgraphLatency,
  ENSJSError,
  getClientErrors,
} from '../utils/errors'
import { namehash } from '../utils/normalise'
import {
  AbiChanged,
  AddrChanged,
  AuthorisationChanged,
  ContenthashChanged,
  ExpiryExtended,
  FusesSet,
  InterfaceChanged,
  MulticoinAddrChanged,
  NameChanged,
  NameRegistered,
  NameRenewed,
  NameTransferred,
  NameUnwrapped,
  NameWrapped,
  NewOwner,
  NewResolver,
  NewTtl,
  PubkeyChanged,
  TextChanged,
  Transfer,
  VersionChanged,
  WrappedTransfer,
} from '../utils/subgraph-types'
import { checkIsDotEth } from '../utils/validation'

type DomainEvent =
  | 'NewOwner'
  | 'NewResolver'
  | 'Transfer'
  | 'NewTTL'
  | 'WrappedTransfer'
  | 'NameWrapped'
  | 'NameUnwrapped'
  | 'FusesSet'
  | 'ExpiryExtended'
type RegistrationEvent = 'NameRegistered' | 'NameRenewed' | 'NameTransferred'
type ResolverEvent =
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

type EventTypes = 'Domain' | 'Registration' | 'Resolver'
type EventFormat = {
  Domain: DomainEvent
  Registration: RegistrationEvent
  Resolver: ResolverEvent
}

const eventFormat: {
  [key in EventTypes]: { [n in EventFormat[key]]: (args: any) => object }
} = {
  Domain: {
    NewOwner: (args: NewOwner) => ({ owner: args.owner.id }),
    NewResolver: (args: NewResolver) => ({
      resolver: args.resolver.id.split('-')[0],
    }),
    Transfer: (args: Transfer) => ({ owner: args.owner.id }),
    NewTTL: (args: NewTtl) => ({ ttl: args.ttl }),
    WrappedTransfer: (args: WrappedTransfer) => ({ owner: args.owner.id }),
    NameWrapped: (args: NameWrapped) => ({
      fuses: args.fuses,
      owner: args.owner.id,
      expiryDate: args.expiryDate,
    }),
    NameUnwrapped: (args: NameUnwrapped) => ({ owner: args.owner.id }),
    FusesSet: (args: FusesSet) => ({ fuses: args.fuses }),
    ExpiryExtended: (args: ExpiryExtended) => ({ expiryDate: args.expiryDate }),
  },
  Registration: {
    NameRegistered: (args: NameRegistered) => ({
      registrant: args.registrant.id,
      expiryDate: args.expiryDate,
    }),
    NameRenewed: (args: NameRenewed) => ({ expiryDate: args.expiryDate }),
    NameTransferred: (args: NameTransferred) => ({ owner: args.newOwner.id }),
  },
  Resolver: {
    AddrChanged: (args: AddrChanged) => ({ addr: args.addr.id }),
    MulticoinAddrChanged: (
      args: Omit<MulticoinAddrChanged, 'addr'> & { multiaddr: string },
    ) => {
      const format = formatsByCoinType[parseInt(args.coinType)]
      if (!format) {
        return {
          coinType: args.coinType,
          rawAddr: args.multiaddr,
        }
      }
      if (hexStripZeros(args.multiaddr) === '0x') {
        return {
          coinType: args.coinType,
          coinName: format.name,
          rawAddr: '0x',
        }
      }
      return {
        coinType: args.coinType,
        coinName: format.name,
        addr: format.encoder(Buffer.from(args.multiaddr.slice(2), 'hex')),
      }
    },
    NameChanged: (args: NameChanged) => ({ name: args.name }),
    AbiChanged: (args: AbiChanged) => ({ contentType: args.contentType }),
    PubkeyChanged: (args: PubkeyChanged) => ({ x: args.x, y: args.y }),
    TextChanged: (args: TextChanged) => ({ key: args.key, value: args.value }),
    ContenthashChanged: (args: ContenthashChanged) => ({
      hash: decodeContenthash(args.hash),
    }),
    InterfaceChanged: (args: InterfaceChanged) => ({
      interfaceId: args.interfaceID,
      implementer: args.implementer,
    }),
    AuthorisationChanged: (args: AuthorisationChanged) => ({
      owner: args.owner,
      target: args.target,
      isAuthorized: args.isAuthorized,
    }),
    VersionChanged: (args: VersionChanged) => ({ version: args.version }),
  },
}

const mapEvents = <T extends EventTypes>(eventArray: any[], type: T) =>
  eventArray.map(
    (event: {
      __typename: EventFormat[T]
      blockNumber: number
      transactionID: string
      id: string
    }) => ({
      type: event.__typename,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionID,
      id: event.id,
      data: eventFormat[type][event.__typename](event),
    }),
  )

type MappedEvents = ReturnType<typeof mapEvents>

export type ReturnData = {
  domain: MappedEvents
  registration?: MappedEvents
  resolver: MappedEvents
}

export async function getHistory(
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  name: string,
) {
  const { client } = gqlInstance
  const query = gqlInstance.gql`
      query getHistory($namehash: String!) {
        domain(id: $namehash) {
          events {
            id
            blockNumber
            transactionID
            __typename
            ...on Transfer {
              owner {
                id
              }
            }
            ...on NewOwner {
              owner {
                id
              }
            }
            ...on NewResolver {
              resolver {
                id
              }
            }
            ...on NewTTL {
              ttl
            }
            ...on WrappedTransfer {
              owner {
                id
              }
            }
            ...on NameWrapped {
              fuses
              expiryDate
              owner {
                id
              }
            }
            ...on NameUnwrapped {
              owner {
                id
              }
            }
            ...on FusesSet {
              fuses
            }
            ...on ExpiryExtended {
              expiryDate
            }
          }
          registration {
            events {
              id
              blockNumber
              transactionID
              __typename
              ...on NameRegistered {
                registrant {
                  id
                }
                expiryDate
              }
              ...on NameRenewed {
                expiryDate
              }
              ...on NameTransferred {
                newOwner {
                  id
                }
              }
            }
          }
          resolver {
            events {
              id
              blockNumber
              transactionID
              __typename
              ...on AddrChanged {
                addr {
                  id
                }
              }
              ...on MulticoinAddrChanged {
                coinType
                multiaddr: addr
              }
              ...on NameChanged {
                name
              }
              ...on AbiChanged {
                contentType
              }
              ...on PubkeyChanged {
                x
                y
              }
              ...on TextChanged {
                key
                value
              }
              ...on ContenthashChanged {
                hash
              }
              ...on InterfaceChanged {
                interfaceID
                implementer
              }
              ...on AuthorisationChanged {
                owner
                target
                isAuthorized
              }
              ...on VersionChanged {
                version
              }
            }
          }
        }
      }
      `

  const nameHash = namehash(name)
  const labels = name.split('.')
  const is2ldEth = checkIsDotEth(labels)

  const response = await client
    .request(query, {
      namehash: nameHash,
    })
    .catch((e: unknown) => {
      throw new ENSJSError({
        errors: getClientErrors(e),
      })
    })
    .finally(debugSubgraphLatency)

  const domain = response?.domain

  if (!domain) return undefined

  const domainEvents = domain.events || []
  const resolverEvents = domain.resolver?.events || []

  const domainHistory = mapEvents(domainEvents, 'Domain')
  const resolverHistory = mapEvents(
    // remove duplicate events for ETH cointype
    resolverEvents.filter(
      (event: any) => !event.coinType || event.coinType !== '60',
    ),
    'Resolver',
  )

  if (is2ldEth) {
    const registrationEvents = domain.registration?.events || []
    const registrationHistory = mapEvents(registrationEvents, 'Registration')
    return {
      domain: domainHistory,
      registration: registrationHistory,
      resolver: resolverHistory,
    }
  }

  return {
    domain: domainHistory,
    resolver: resolverHistory,
  }
}
