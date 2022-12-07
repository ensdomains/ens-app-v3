"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getHistory_exports = {};
__export(getHistory_exports, {
  getHistory: () => getHistory
});
module.exports = __toCommonJS(getHistory_exports);
var import_address_encoder = require("@ensdomains/address-encoder");
var import_ethers = require("ethers");
var import_contentHash = require("../utils/contentHash");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
const eventFormat = {
  Domain: {
    NewOwner: (args) => ({ owner: args.owner.id }),
    NewResolver: (args) => ({ resolver: args.resolver.id.split("-")[0] }),
    Transfer: (args) => ({ owner: args.owner.id }),
    NewTTL: (args) => ({ ttl: args.ttl }),
    WrappedTransfer: (args) => ({ owner: args.owner.id }),
    NameWrapped: (args) => ({
      fuses: args.fuses,
      owner: args.owner.id,
      expiry: args.expiry
    }),
    NameUnwrapped: (args) => ({ owner: args.owner.id }),
    FusesSet: (args) => ({ fuses: args.fuses, expiry: args.expiry })
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
      const format = import_address_encoder.formatsByCoinType[parseInt(args.coinType)];
      if (!format) {
        return {
          coinType: args.coinType,
          rawAddr: args.multiaddr
        };
      }
      if (import_ethers.ethers.utils.hexStripZeros(args.multiaddr) === "0x") {
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
    ContenthashChanged: (args) => ({ hash: (0, import_contentHash.decodeContenthash)(args.hash) }),
    InterfaceChanged: (args) => ({
      interfaceId: args.interfaceId,
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
const mapEvents = (eventArray, type) => eventArray.map(
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
      `;
  const label = name.split(".")[0];
  const nameHash = (0, import_normalise.namehash)(name);
  const labelHash = (0, import_labels.labelhash)(label);
  const { domain } = await client.request(query, {
    namehash: nameHash,
    labelhash: labelHash
  });
  if (!domain)
    return;
  const {
    events: domainEvents,
    registration: { events: registrationEvents },
    resolver: { events: resolverEvents }
  } = domain;
  const domainHistory = mapEvents(domainEvents, "Domain");
  const registrationHistory = mapEvents(registrationEvents, "Registration");
  const resolverHistory = mapEvents(
    resolverEvents.filter(
      (event) => !event.coinType || event.coinType !== "60"
    ),
    "Resolver"
  );
  return {
    domain: domainHistory,
    registration: registrationHistory,
    resolver: resolverHistory
  };
}
