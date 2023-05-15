// src/functions/getHistory.ts
import { formatsByCoinType } from "@ensdomains/address-encoder";
import { hexStripZeros } from "@ethersproject/bytes";
import { decodeContenthash } from "../utils/contentHash.mjs";
import {
  debugSubgraphLatency,
  ENSJSError,
  getClientErrors
} from "../utils/errors.mjs";
import { namehash } from "../utils/normalise.mjs";
import { checkIsDotEth } from "../utils/validation.mjs";
var eventFormat = {
  Domain: {
    NewOwner: (args) => ({ owner: args.owner.id }),
    NewResolver: (args) => ({
      resolver: args.resolver.id.split("-")[0]
    }),
    Transfer: (args) => ({ owner: args.owner.id }),
    NewTTL: (args) => ({ ttl: args.ttl }),
    WrappedTransfer: (args) => ({ owner: args.owner.id }),
    NameWrapped: (args) => ({
      fuses: args.fuses,
      owner: args.owner.id,
      expiryDate: args.expiryDate
    }),
    NameUnwrapped: (args) => ({ owner: args.owner.id }),
    FusesSet: (args) => ({ fuses: args.fuses }),
    ExpiryExtended: (args) => ({ expiryDate: args.expiryDate })
  },
  Registration: {
    NameRegistered: (args) => ({
      registrant: args.registrant.id,
      expiryDate: args.expiryDate
    }),
    NameRenewed: (args) => ({ expiryDate: args.expiryDate }),
    NameTransferred: (args) => ({ owner: args.newOwner.id })
  },
  Resolver: {
    AddrChanged: (args) => ({ addr: args.addr.id }),
    MulticoinAddrChanged: (args) => {
      const format = formatsByCoinType[parseInt(args.coinType)];
      if (!format) {
        return {
          coinType: args.coinType,
          rawAddr: args.multiaddr
        };
      }
      if (hexStripZeros(args.multiaddr) === "0x") {
        return {
          coinType: args.coinType,
          coinName: format.name,
          rawAddr: "0x"
        };
      }
      return {
        coinType: args.coinType,
        coinName: format.name,
        addr: format.encoder(Buffer.from(args.multiaddr.slice(2), "hex"))
      };
    },
    NameChanged: (args) => ({ name: args.name }),
    AbiChanged: (args) => ({ contentType: args.contentType }),
    PubkeyChanged: (args) => ({ x: args.x, y: args.y }),
    TextChanged: (args) => ({ key: args.key, value: args.value }),
    ContenthashChanged: (args) => ({
      hash: decodeContenthash(args.hash)
    }),
    InterfaceChanged: (args) => ({
      interfaceId: args.interfaceID,
      implementer: args.implementer
    }),
    AuthorisationChanged: (args) => ({
      owner: args.owner,
      target: args.target,
      isAuthorized: args.isAuthorized
    }),
    VersionChanged: (args) => ({ version: args.version })
  }
};
var mapEvents = (eventArray, type) => eventArray.map(
  (event) => ({
    type: event.__typename,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionID,
    id: event.id,
    data: eventFormat[type][event.__typename](event)
  })
);
async function getHistory({ gqlInstance }, name) {
  const { client } = gqlInstance;
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
      `;
  const nameHash = namehash(name);
  const labels = name.split(".");
  const is2ldEth = checkIsDotEth(labels);
  const response = await client.request(query, {
    namehash: nameHash
  }).catch((e) => {
    throw new ENSJSError({
      errors: getClientErrors(e)
    });
  }).finally(debugSubgraphLatency);
  const domain = response?.domain;
  if (!domain)
    return void 0;
  const domainEvents = domain.events || [];
  const resolverEvents = domain.resolver?.events || [];
  const domainHistory = mapEvents(domainEvents, "Domain");
  const resolverHistory = mapEvents(
    resolverEvents.filter(
      (event) => !event.coinType || event.coinType !== "60"
    ),
    "Resolver"
  );
  if (is2ldEth) {
    const registrationEvents = domain.registration?.events || [];
    const registrationHistory = mapEvents(registrationEvents, "Registration");
    return {
      domain: domainHistory,
      registration: registrationHistory,
      resolver: resolverHistory
    };
  }
  return {
    domain: domainHistory,
    resolver: resolverHistory
  };
}
export {
  getHistory
};
