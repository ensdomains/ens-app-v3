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
var contracts_exports = {};
__export(contracts_exports, {
  default: () => ContractManager
});
module.exports = __toCommonJS(contracts_exports);
class ContractManager {
  constructor(provider, fetchAddress, getModule) {
    this.getModule = async (name) => {
      const mod = await import(
        /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
        `../generated/factories/${name}__factory`
      );
      return mod[`${name}__factory`];
    };
    this.generateContractGetter = (name) => {
      return async (passedProvider, address) => {
        const mod = await this.getModule(name);
        const inputAddress = address || this.fetchAddress(name);
        const provider = passedProvider || this.provider;
        return mod.connect(inputAddress, provider);
      };
    };
    this.getPublicResolver = this.generateContractGetter("PublicResolver");
    this.getUniversalResolver = this.generateContractGetter("UniversalResolver");
    this.getRegistry = this.generateContractGetter("ENSRegistry");
    this.getReverseRegistrar = this.generateContractGetter("ReverseRegistrar");
    this.getNameWrapper = this.generateContractGetter("NameWrapper");
    this.getDNSRegistrar = this.generateContractGetter("DNSRegistrar");
    this.getBaseRegistrar = this.generateContractGetter(
      "BaseRegistrarImplementation"
    );
    this.getEthRegistrarController = this.generateContractGetter(
      "ETHRegistrarController"
    );
    this.getMulticall = this.generateContractGetter("Multicall");
    this.getBulkRenewal = this.generateContractGetter("BulkRenewal");
    this.provider = provider;
    this.fetchAddress = fetchAddress;
    if (getModule) {
      this.getModule = getModule;
    }
  }
}
