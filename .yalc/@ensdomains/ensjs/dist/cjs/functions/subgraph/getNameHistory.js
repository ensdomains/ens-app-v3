"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_encoder_1 = require("@ensdomains/address-encoder");
const graphql_request_1 = require("graphql-request");
const viem_1 = require("viem");
const contentHash_js_1 = require("../../utils/contentHash.js");
const normalise_js_1 = require("../../utils/normalise.js");
const client_js_1 = require("./client.js");
const getNameHistory = async (client, { name }) => {
    const subgraphClient = (0, client_js_1.createSubgraphClient)({ client });
    const query = (0, graphql_request_1.gql) `
    query getNameHistory($id: String!) {
      domain(id: $id) {
        events {
          id
          blockNumber
          transactionID
          type: __typename
          ... on Transfer {
            owner {
              id
            }
          }
          ... on NewOwner {
            owner {
              id
            }
          }
          ... on NewResolver {
            resolver {
              id
            }
          }
          ... on NewTTL {
            ttl
          }
          ... on WrappedTransfer {
            owner {
              id
            }
          }
          ... on NameWrapped {
            fuses
            expiryDate
            owner {
              id
            }
          }
          ... on NameUnwrapped {
            owner {
              id
            }
          }
          ... on FusesSet {
            fuses
          }
          ... on ExpiryExtended {
            expiryDate
          }
        }
        registration {
          events {
            id
            blockNumber
            transactionID
            type: __typename
            ... on NameRegistered {
              registrant {
                id
              }
              expiryDate
            }
            ... on NameRenewed {
              expiryDate
            }
            ... on NameTransferred {
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
            type: __typename
            ... on AddrChanged {
              addr {
                id
              }
            }
            ... on MulticoinAddrChanged {
              coinType
              multiaddr: addr
            }
            ... on NameChanged {
              name
            }
            ... on AbiChanged {
              contentType
            }
            ... on PubkeyChanged {
              x
              y
            }
            ... on TextChanged {
              key
              value
            }
            ... on ContenthashChanged {
              hash
            }
            ... on InterfaceChanged {
              interfaceID
              implementer
            }
            ... on AuthorisationChanged {
              owner
              target
              isAuthorized
            }
            ... on VersionChanged {
              version
            }
          }
        }
      }
    }
  `;
    const queryVars = {
        id: (0, normalise_js_1.namehash)(name),
    };
    const result = await subgraphClient.request(query, queryVars);
    if (!result.domain)
        return null;
    const domainEvents = result.domain.events.map((event) => {
        switch (event.type) {
            case 'NewResolver': {
                return {
                    ...event,
                    resolver: event.resolver.id.split('-')[0],
                };
            }
            case 'NewOwner':
            case 'Transfer':
            case 'WrappedTransfer':
            case 'NameWrapped':
            case 'NameUnwrapped': {
                return {
                    ...event,
                    owner: event.owner.id,
                };
            }
            default:
                return event;
        }
    });
    const registrationEvents = result.domain?.registration?.events.map((event) => {
        switch (event.type) {
            case 'NameRegistered': {
                return {
                    ...event,
                    registrant: event.registrant.id,
                };
            }
            case 'NameTransferred': {
                return {
                    ...event,
                    newOwner: event.newOwner.id,
                };
            }
            default:
                return event;
        }
    });
    const resolverEvents = result.domain?.resolver?.events.map((event) => {
        switch (event.type) {
            case 'AddrChanged': {
                return {
                    ...event,
                    addr: event.addr.id,
                };
            }
            case 'MulticoinAddrChanged': {
                const { multiaddr, ...event_ } = event;
                const format = (0, address_encoder_1.getCoderByCoinType)(parseInt(event.coinType));
                if (!format) {
                    return {
                        ...event_,
                        coinName: null,
                        decoded: false,
                        addr: multiaddr,
                    };
                }
                if (multiaddr === '0x' || (0, viem_1.trim)(multiaddr) === '0x00') {
                    return {
                        ...event_,
                        coinName: format.name,
                        decoded: true,
                        addr: null,
                    };
                }
                return {
                    ...event_,
                    coinName: format.name,
                    decoded: true,
                    addr: format.encode((0, viem_1.hexToBytes)(multiaddr)),
                };
            }
            case 'ContenthashChanged': {
                const { decoded: contentHash, protocolType } = (0, contentHash_js_1.decodeContentHash)(event.hash) || { protocolType: null, decoded: null };
                return {
                    ...event,
                    decoded: contentHash !== null,
                    contentHash,
                    protocolType,
                };
            }
            default:
                return event;
        }
    });
    return {
        domainEvents,
        registrationEvents: registrationEvents || null,
        resolverEvents: resolverEvents || null,
    };
};
exports.default = getNameHistory;
//# sourceMappingURL=getNameHistory.js.map