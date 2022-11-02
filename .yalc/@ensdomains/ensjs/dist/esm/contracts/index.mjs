// src/contracts/index.ts
import getBaseRegistrar from "./baseRegistrar.mjs";
import getEthRegistrarController from "./ethRegistrarController.mjs";
import getMulticall from "./multicall.mjs";
import getNameWrapper from "./nameWrapper.mjs";
import getDNSRegistrar from "./dnsRegistrar.mjs";
import getPublicResolver from "./publicResolver.mjs";
import getRegistry from "./registry.mjs";
import getReverseRegistrar from "./reverseRegistrar.mjs";
import getUniversalResolver from "./universalResolver.mjs";
import getBulkRenewal from "./bulkRenewal.mjs";
var ContractManager = class {
  provider;
  fetchAddress;
  constructor(provider, fetchAddress) {
    this.provider = provider;
    this.fetchAddress = fetchAddress;
  }
  generateContractGetter = (name, func) => {
    return async (passedProvider, address) => {
      const inputAddress = address || this.fetchAddress(name);
      const provider = passedProvider || this.provider;
      return func(provider, inputAddress);
    };
  };
  getPublicResolver = this.generateContractGetter(
    "PublicResolver",
    getPublicResolver
  );
  getUniversalResolver = this.generateContractGetter(
    "UniversalResolver",
    getUniversalResolver
  );
  getRegistry = this.generateContractGetter(
    "ENSRegistryWithFallback",
    getRegistry
  );
  getReverseRegistrar = this.generateContractGetter(
    "ReverseRegistrar",
    getReverseRegistrar
  );
  getNameWrapper = this.generateContractGetter(
    "NameWrapper",
    getNameWrapper
  );
  getDNSRegistrar = this.generateContractGetter(
    "DNSRegistrar",
    getDNSRegistrar
  );
  getBaseRegistrar = this.generateContractGetter(
    "BaseRegistrarImplementation",
    getBaseRegistrar
  );
  getEthRegistrarController = this.generateContractGetter(
    "ETHRegistrarController",
    getEthRegistrarController
  );
  getMulticall = this.generateContractGetter("Multicall", getMulticall);
  getBulkRenewal = this.generateContractGetter(
    "BulkRenewal",
    getBulkRenewal
  );
};
export {
  ContractManager as default
};
