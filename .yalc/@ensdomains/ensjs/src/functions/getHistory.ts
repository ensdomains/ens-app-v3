import { formatsByCoinType } from '@ensdomains/address-encoder'
import { ethers } from 'ethers'
import { ENSArgs } from '..'
import { decodeContenthash } from '../utils/contentHash'
import { labelhash } from '../utils/labels'
import { namehash } from '../utils/normalise'

type DomainEvent =
  | 'NewOwner'
  | 'NewResolver'
  | 'Transfer'
  | 'NewTTL'
  | 'WrappedTransfer'
  | 'NameWrapped'
  | 'NameUnwrapped'
  | 'FusesSet'
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
    NewOwner: (args: any) => ({ owner: args.owner.id }),
    NewResolver: (args: any) => ({ resolver: args.resolver.id.split('-')[0] }),
    Transfer: (args: any) => ({ owner: args.owner.id }),
    NewTTL: (args: any) => ({ ttl: args.ttl }),
    WrappedTransfer: (args: any) => ({ owner: args.owner.id }),
    NameWrapped: (args: any) => ({
      fuses: args.fuses,
      owner: args.owner.id,
      expiry: args.expiry,
    }),
    NameUnwrapped: (args: any) => ({ owner: args.owner.id }),
    FusesSet: (args: any) => ({ fuses: args.fuses, expiry: args.expiry }),
  },
  Registration: {
    NameRegistered: (args: any) => ({
      registrant: args.registrant.id,
      expiryDate: args.expiryDate,
    }),
    NameRenewed: (args: any) => ({ expiryDate: args.expiryDate }),
    NameTransferred: (args: any) => ({ owner: args.newOwner.id }),
  },
  Resolver: {
    AddrChanged: (args: any) => ({ addr: args.addr.id }),
    MulticoinAddrChanged: (args: any) => {
      const format = formatsByCoinType[parseInt(args.coinType)]
      if (!format) {
        return {
          coinType: args.coinType,
          rawAddr: args.multiaddr,
        }
      }
      if (ethers.utils.hexStripZeros(args.multiaddr) === '0x') {
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
    NameChanged: (args: any) => ({ name: args.name }),
    AbiChanged: (args: any) => ({ contentType: args.contentType }),
    PubkeyChanged: (args: any) => ({ x: args.x, y: args.y }),
    TextChanged: (args: any) => ({ key: args.key, value: args.value }),
    ContenthashChanged: (args: any) => ({ hash: decodeContenthash(args.hash) }),
    InterfaceChanged: (args: any) => ({
      interfaceId: args.interfaceId,
      implementer: args.implementer,
    }),
    AuthorisationChanged: (args: any) => ({
      owner: args.owner,
      target: args.target,
      isAuthorized: args.isAuthorized,
    }),
    VersionChanged: (args: any) => ({ version: args.version }),
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

export async function getHistory(
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  name: string,
) {
  const { client } = gqlInstance
  const query = gqlInstance.gql`
      query getHistory($namehash: String!, $labelhash: String!) {
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
              expiry
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
              expiry
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

  const label = name.split('.')[0]

  const nameHash = namehash(name)
  const labelHash = labelhash(label)

  const { domain } = await client.request(query, {
    namehash: nameHash,
    labelhash: labelHash,
  })

  if (!domain) return

  const {
    events: domainEvents,
    registration: { events: registrationEvents },
    resolver: { events: resolverEvents },
  } = domain

  const domainHistory = mapEvents(domainEvents, 'Domain')
  const registrationHistory = mapEvents(registrationEvents, 'Registration')
  const resolverHistory = mapEvents(
    // remove duplicate events for ETH cointype
    resolverEvents.filter(
      (event: any) => !event.coinType || event.coinType !== '60',
    ),
    'Resolver',
  )

  return {
    domain: domainHistory,
    registration: registrationHistory,
    resolver: resolverHistory,
  }
}
