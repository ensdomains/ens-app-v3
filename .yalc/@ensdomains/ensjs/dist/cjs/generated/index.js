"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var generated_exports = {};
__export(generated_exports, {
  BaseRegistrarImplementation__factory: () => import_BaseRegistrarImplementation_factory.BaseRegistrarImplementation__factory,
  BulkRenewal__factory: () => import_BulkRenewal_factory.BulkRenewal__factory,
  DNSRegistrar__factory: () => import_DNSRegistrar_factory.DNSRegistrar__factory,
  DNSSECImpl__factory: () => import_DNSSECImpl_factory.DNSSECImpl__factory,
  DefaultReverseResolver__factory: () => import_DefaultReverseResolver_factory.DefaultReverseResolver__factory,
  ENSRegistry__factory: () => import_ENSRegistry_factory.ENSRegistry__factory,
  ETHRegistrarController__factory: () => import_ETHRegistrarController_factory.ETHRegistrarController__factory,
  Multicall__factory: () => import_Multicall_factory.Multicall__factory,
  NameWrapper__factory: () => import_NameWrapper_factory.NameWrapper__factory,
  P256SHA256Algorithm__factory: () => import_P256SHA256Algorithm_factory.P256SHA256Algorithm__factory,
  PublicResolver__factory: () => import_PublicResolver_factory.PublicResolver__factory,
  RSASHA1Algorithm__factory: () => import_RSASHA1Algorithm_factory.RSASHA1Algorithm__factory,
  RSASHA256Algorithm__factory: () => import_RSASHA256Algorithm_factory.RSASHA256Algorithm__factory,
  ReverseRegistrar__factory: () => import_ReverseRegistrar_factory.ReverseRegistrar__factory,
  Root__factory: () => import_Root_factory.Root__factory,
  SHA1Digest__factory: () => import_SHA1Digest_factory.SHA1Digest__factory,
  SHA1NSEC3Digest__factory: () => import_SHA1NSEC3Digest_factory.SHA1NSEC3Digest__factory,
  SHA256Digest__factory: () => import_SHA256Digest_factory.SHA256Digest__factory,
  StaticMetadataService__factory: () => import_StaticMetadataService_factory.StaticMetadataService__factory,
  TLDPublicSuffixList__factory: () => import_TLDPublicSuffixList_factory.TLDPublicSuffixList__factory,
  UniversalResolver__factory: () => import_UniversalResolver_factory.UniversalResolver__factory,
  factories: () => factories
});
module.exports = __toCommonJS(generated_exports);
var factories = __toESM(require("./factories"));
var import_BaseRegistrarImplementation_factory = require("./factories/BaseRegistrarImplementation__factory");
var import_DefaultReverseResolver_factory = require("./factories/DefaultReverseResolver__factory");
var import_DNSRegistrar_factory = require("./factories/DNSRegistrar__factory");
var import_DNSSECImpl_factory = require("./factories/DNSSECImpl__factory");
var import_ENSRegistry_factory = require("./factories/ENSRegistry__factory");
var import_ETHRegistrarController_factory = require("./factories/ETHRegistrarController__factory");
var import_P256SHA256Algorithm_factory = require("./factories/P256SHA256Algorithm__factory");
var import_PublicResolver_factory = require("./factories/PublicResolver__factory");
var import_ReverseRegistrar_factory = require("./factories/ReverseRegistrar__factory");
var import_Root_factory = require("./factories/Root__factory");
var import_RSASHA1Algorithm_factory = require("./factories/RSASHA1Algorithm__factory");
var import_RSASHA256Algorithm_factory = require("./factories/RSASHA256Algorithm__factory");
var import_SHA1Digest_factory = require("./factories/SHA1Digest__factory");
var import_SHA1NSEC3Digest_factory = require("./factories/SHA1NSEC3Digest__factory");
var import_SHA256Digest_factory = require("./factories/SHA256Digest__factory");
var import_TLDPublicSuffixList_factory = require("./factories/TLDPublicSuffixList__factory");
var import_Multicall_factory = require("./factories/Multicall__factory");
var import_NameWrapper_factory = require("./factories/NameWrapper__factory");
var import_StaticMetadataService_factory = require("./factories/StaticMetadataService__factory");
var import_UniversalResolver_factory = require("./factories/UniversalResolver__factory");
var import_BulkRenewal_factory = require("./factories/BulkRenewal__factory");
