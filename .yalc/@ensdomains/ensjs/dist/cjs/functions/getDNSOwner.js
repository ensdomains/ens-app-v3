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
var getDNSOwner_exports = {};
__export(getDNSOwner_exports, {
  default: () => getDNSOwner_default,
  dnsQuery: () => dnsQuery,
  encodeURLParams: () => encodeURLParams,
  getDNS: () => getDNS
});
module.exports = __toCommonJS(getDNSOwner_exports);
var packet = __toESM(require("dns-packet"));
function encodeURLParams(p) {
  return Object.entries(p).map((kv) => kv.map(encodeURIComponent).join("=")).join("&");
}
const getDNS = async (q) => {
  const response = await global.fetch(
    `https://cloudflare-dns.com/dns-query?${encodeURLParams({
      ct: "application/dns-udpwireformat",
      dns: packet.encode(q)?.toString("base64"),
      ts: Date.now().toString()
    })}`
  );
  const arrayBuffer = await response.arrayBuffer();
  const fromArrayBuffer = Buffer.from(arrayBuffer);
  return packet.decode(fromArrayBuffer);
};
const dnsQuery = async (qtype, qname) => {
  const query = {
    type: "query",
    id: 1,
    flags: packet.RECURSION_DESIRED,
    questions: [
      {
        type: qtype,
        class: "IN",
        name: qname
      }
    ],
    additionals: [
      {
        type: "OPT",
        class: "IN",
        name: ".",
        udpPayloadSize: 4096,
        flags: packet.DNSSEC_OK
      }
    ],
    answers: []
  };
  const response = await getDNS(query);
  if (response.rcode !== "NOERROR") {
    throw new Error(`DNS query failed: ${response.rcode}`);
  }
  return response;
};
async function getDNSOwner_default(_, dnsName) {
  const result = await dnsQuery("TXT", `_ens.${dnsName}`);
  const address = result?.answers?.[0]?.data?.[0]?.toString()?.split("=")?.[1];
  return address;
}
