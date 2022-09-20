// src/contracts/getContractAddress.ts
var addresses = {
  BaseRegistrarImplementation: {
    "1": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    "3": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    "4": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    "5": "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"
  },
  ETHRegistrarController: {
    "1": "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5",
    "3": "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5",
    "4": "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5",
    "5": "0x283af0b28c62c092c9727f1ee09c02ca627eb7f5"
  },
  Multicall: "0xcA11bde05977b3631167028862bE2a173976CA11",
  NameWrapper: "0x0000000000000000000000000000000000000000",
  PublicResolver: {
    "1": "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41"
  },
  ENSRegistryWithFallback: {
    "1": "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    "3": "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    "4": "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e",
    "5": "0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e"
  },
  ReverseRegistrar: {
    "1": "0x084b1c3C81545d370f3634392De611CaaBFf8148"
  },
  UniversalResolver: {
    "1": "0x580AF46E06DaaD47eb5940526FD64d95b815Cb70",
    "4": "0x74e20bd2a1fe0cdbe45b9a1d89cb7e0a45b36376"
  }
};
var getContractAddress = (networkId) => (contractName) => {
  try {
    return typeof addresses[contractName] === "string" ? addresses[contractName] : addresses[contractName][networkId];
  } catch {
    throw new Error(
      `No address for contract ${contractName} on network ${networkId}`
    );
  }
};
export {
  getContractAddress
};
