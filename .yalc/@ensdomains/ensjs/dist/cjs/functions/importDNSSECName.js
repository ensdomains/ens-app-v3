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
var importDNSSECName_exports = {};
__export(importDNSSECName_exports, {
  DNS_OVER_HTTP_ENDPOINT: () => DNS_OVER_HTTP_ENDPOINT,
  default: () => importDNSSECName_default
});
module.exports = __toCommonJS(importDNSSECName_exports);
var import_dnssecoraclejs = require("@ensdomains/dnssecoraclejs");
var import_dns_packet = __toESM(require("dns-packet"));
var import_consts = require("../utils/consts");
const DNS_OVER_HTTP_ENDPOINT = "https://1.1.1.1/dns-query";
async function importDNSSECName_default({ contracts, provider }, name, { address, proverResult }) {
  const dnsRegistrarContract = await (contracts == null ? void 0 : contracts.getDNSRegistrar());
  const resolverContract = await (contracts == null ? void 0 : contracts.getPublicResolver());
  const registrarOracle = await (dnsRegistrarContract == null ? void 0 : dnsRegistrarContract.oracle());
  if (!registrarOracle) {
    throw new Error("No oracle found");
  }
  const oracle = new import_dnssecoraclejs.Oracle(registrarOracle, provider);
  const proofData = await oracle.getProofData(proverResult);
  const encodedName = `0x${import_dns_packet.default.name.encode(name).toString("hex")}`;
  const data = proofData.rrsets.map(
    (x) => Object.values(x)
  );
  const { proof } = proofData;
  if (address === import_consts.EMPTY_ADDRESS) {
    return dnsRegistrarContract == null ? void 0 : dnsRegistrarContract.populateTransaction.proveAndClaim(
      encodedName,
      data,
      proof
    );
  }
  if (address) {
    return dnsRegistrarContract == null ? void 0 : dnsRegistrarContract.populateTransaction.proveAndClaimWithResolver(
      encodedName,
      data,
      proof,
      resolverContract.address,
      address
    );
  }
}
