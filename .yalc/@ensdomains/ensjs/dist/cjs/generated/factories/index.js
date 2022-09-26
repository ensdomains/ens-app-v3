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
var factories_exports = {};
__export(factories_exports, {
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
  UniversalResolver__factory: () => import_UniversalResolver_factory.UniversalResolver__factory
});
module.exports = __toCommonJS(factories_exports);
var import_BaseRegistrarImplementation_factory = require("./BaseRegistrarImplementation__factory");
var import_BulkRenewal_factory = require("./BulkRenewal__factory");
var import_DNSRegistrar_factory = require("./DNSRegistrar__factory");
var import_DNSSECImpl_factory = require("./DNSSECImpl__factory");
var import_DefaultReverseResolver_factory = require("./DefaultReverseResolver__factory");
var import_ENSRegistry_factory = require("./ENSRegistry__factory");
var import_ETHRegistrarController_factory = require("./ETHRegistrarController__factory");
var import_Multicall_factory = require("./Multicall__factory");
var import_NameWrapper_factory = require("./NameWrapper__factory");
var import_P256SHA256Algorithm_factory = require("./P256SHA256Algorithm__factory");
var import_PublicResolver_factory = require("./PublicResolver__factory");
var import_RSASHA1Algorithm_factory = require("./RSASHA1Algorithm__factory");
var import_RSASHA256Algorithm_factory = require("./RSASHA256Algorithm__factory");
var import_ReverseRegistrar_factory = require("./ReverseRegistrar__factory");
var import_Root_factory = require("./Root__factory");
var import_SHA1Digest_factory = require("./SHA1Digest__factory");
var import_SHA1NSEC3Digest_factory = require("./SHA1NSEC3Digest__factory");
var import_SHA256Digest_factory = require("./SHA256Digest__factory");
var import_StaticMetadataService_factory = require("./StaticMetadataService__factory");
var import_TLDPublicSuffixList_factory = require("./TLDPublicSuffixList__factory");
var import_UniversalResolver_factory = require("./UniversalResolver__factory");
