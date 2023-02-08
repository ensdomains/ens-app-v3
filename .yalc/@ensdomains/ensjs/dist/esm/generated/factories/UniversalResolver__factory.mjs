var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/generated/factories/UniversalResolver__factory.ts
import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
var _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registry",
        type: "address"
      },
      {
        internalType: "string[]",
        name: "_urls",
        type: "string[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "string[]",
        name: "urls",
        type: "string[]"
      },
      {
        internalType: "bytes",
        name: "callData",
        type: "bytes"
      },
      {
        internalType: "bytes4",
        name: "callbackFunction",
        type: "bytes4"
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes"
      }
    ],
    name: "OffchainLookup",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
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
        name: "data",
        type: "bytes"
      },
      {
        internalType: "string[]",
        name: "gateways",
        type: "string[]"
      },
      {
        internalType: "bytes4",
        name: "callbackFunction",
        type: "bytes4"
      },
      {
        internalType: "bytes",
        name: "metaData",
        type: "bytes"
      }
    ],
    name: "_resolveSingle",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      },
      {
        internalType: "address",
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
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "batchGatewayURLs",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
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
      }
    ],
    name: "findResolver",
    outputs: [
      {
        internalType: "contract Resolver",
        name: "",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "registry",
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
    name: "renounceOwnership",
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
        internalType: "bytes",
        name: "data",
        type: "bytes"
      },
      {
        internalType: "string[]",
        name: "gateways",
        type: "string[]"
      }
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      },
      {
        internalType: "address",
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
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      }
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes[]",
        name: "",
        type: "bytes[]"
      },
      {
        internalType: "address",
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
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]"
      },
      {
        internalType: "string[]",
        name: "gateways",
        type: "string[]"
      }
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes[]",
        name: "",
        type: "bytes[]"
      },
      {
        internalType: "address",
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
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      },
      {
        internalType: "address",
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
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes"
      }
    ],
    name: "resolveCallback",
    outputs: [
      {
        internalType: "bytes[]",
        name: "",
        type: "bytes[]"
      },
      {
        internalType: "address",
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
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes"
      }
    ],
    name: "resolveSingleCallback",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      },
      {
        internalType: "address",
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
        name: "reverseName",
        type: "bytes"
      },
      {
        internalType: "string[]",
        name: "gateways",
        type: "string[]"
      }
    ],
    name: "reverse",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
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
        name: "reverseName",
        type: "bytes"
      }
    ],
    name: "reverse",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
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
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "extraData",
        type: "bytes"
      }
    ],
    name: "reverseCallback",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
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
        internalType: "string[]",
        name: "_urls",
        type: "string[]"
      }
    ],
    name: "setGatewayURLs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
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
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
var UniversalResolver__factory = class {
  static createInterface() {
    return new Interface(_abi);
  }
  static connect(address, signerOrProvider) {
    return new Contract(address, _abi, signerOrProvider);
  }
};
__publicField(UniversalResolver__factory, "abi", _abi);
export {
  UniversalResolver__factory
};
