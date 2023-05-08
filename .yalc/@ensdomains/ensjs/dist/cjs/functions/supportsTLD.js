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
var supportsTLD_exports = {};
__export(supportsTLD_exports, {
  default: () => supportsTLD_default
});
module.exports = __toCommonJS(supportsTLD_exports);
var import_DNSRegistrar_factory = require("../generated/factories/DNSRegistrar__factory");
const DNSSEC_CLAIM_INTERFACE_IDS = ["0x2f435428", "0x17d8f49b", "0x1aa2e641"];
async function supportsTLD_default({ getOwner, provider }, name) {
  try {
    const labels = name.split(".");
    const tld = labels[labels.length - 1];
    if (tld === "eth")
      return true;
    const tldOwner = await getOwner(tld, { contract: "registry" });
    if (!(tldOwner == null ? void 0 : tldOwner.owner))
      return false;
    const dnsRegistrar = import_DNSRegistrar_factory.DNSRegistrar__factory.connect(
      tldOwner.owner,
      provider
    );
    const supports = await Promise.all(
      DNSSEC_CLAIM_INTERFACE_IDS.map(
        (interfaceId) => dnsRegistrar.supportsInterface(interfaceId)
      )
    );
    return supports.some((s) => !!s);
  } catch {
    return false;
  }
}
