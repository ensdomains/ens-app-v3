// src/contracts/index.ts
var ContractManager = class {
  provider;
  fetchAddress;
  getModule = async (name) => {
    const mod = await import(
      /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
      `../generated/factories/${name}__factory`
    );
    return mod[`${name}__factory`];
  };
  constructor(provider, fetchAddress, getModule) {
    this.provider = provider;
    this.fetchAddress = fetchAddress;
    if (getModule) {
      this.getModule = getModule;
    }
  }
  generateContractGetter = (name) => {
    return async (passedProvider, address) => {
      const mod = await this.getModule(name);
      const inputAddress = address || this.fetchAddress(name);
      const provider = passedProvider || this.provider;
      return mod.connect(inputAddress, provider);
    };
  };
  getPublicResolver = this.generateContractGetter("PublicResolver");
  getUniversalResolver = this.generateContractGetter("UniversalResolver");
  getRegistry = this.generateContractGetter("ENSRegistry");
  getReverseRegistrar = this.generateContractGetter("ReverseRegistrar");
  getNameWrapper = this.generateContractGetter("NameWrapper");
  getDNSRegistrar = this.generateContractGetter("DNSRegistrar");
  getBaseRegistrar = this.generateContractGetter(
    "BaseRegistrarImplementation"
  );
  getEthRegistrarController = this.generateContractGetter(
    "ETHRegistrarController"
  );
  getMulticall = this.generateContractGetter("Multicall");
  getBulkRenewal = this.generateContractGetter("BulkRenewal");
};
export {
  ContractManager as default
};
