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
var DNSRegistrar_factory_exports = {};
__export(DNSRegistrar_factory_exports, {
  DNSRegistrar__factory: () => DNSRegistrar__factory
});
module.exports = __toCommonJS(DNSRegistrar_factory_exports);
var import_abi = require("@ethersproject/abi");
var import_contracts = require("@ethersproject/contracts");
const _abi = [
  {
    inputs: [
      {
        internalType: "contract DNSSEC",
        name: "_dnssec",
        type: "address"
      },
      {
        internalType: "contract PublicSuffixList",
        name: "_suffixes",
        type: "address"
      },
      {
        internalType: "contract ENS",
        name: "_ens",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "dnsname",
        type: "bytes"
      }
    ],
    name: "Claim",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oracle",
        type: "address"
      }
    ],
    name: "NewOracle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "suffixes",
        type: "address"
      }
    ],
    name: "NewPublicSuffixList",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes"
      }
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "ens",
    outputs: [
      {
        internalType: "contract ENS",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract DNSSEC",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "rrset",
            type: "bytes"
          },
          {
            internalType: "bytes",
            name: "sig",
            type: "bytes"
          }
        ],
        internalType: "struct DNSSEC.RRSetWithSignature[]",
        name: "input",
        type: "tuple[]"
      },
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes"
      }
    ],
    name: "proveAndClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes"
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "rrset",
            type: "bytes"
          },
          {
            internalType: "bytes",
            name: "sig",
            type: "bytes"
          }
        ],
        internalType: "struct DNSSEC.RRSetWithSignature[]",
        name: "input",
        type: "tuple[]"
      },
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes"
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address"
      },
      {
        internalType: "address",
        name: "addr",
        type: "address"
      }
    ],
    name: "proveAndClaimWithResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract DNSSEC",
        name: "_dnssec",
        type: "address"
      }
    ],
    name: "setOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract PublicSuffixList",
        name: "_suffixes",
        type: "address"
      }
    ],
    name: "setPublicSuffixList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "suffixes",
    outputs: [
      {
        internalType: "contract PublicSuffixList",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "pure",
    type: "function"
  }
];
class DNSRegistrar__factory {
  static createInterface() {
    return new import_abi.Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new import_contracts.Contract(address, _abi, signerOrProvider);
  }
}
DNSRegistrar__factory.abi = _abi;
