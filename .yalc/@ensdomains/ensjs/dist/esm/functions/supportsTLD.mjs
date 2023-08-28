// src/functions/supportsTLD.ts
import { DNSRegistrar__factory } from "../generated/factories/DNSRegistrar__factory.mjs";
var DNSSEC_CLAIM_INTERFACE_IDS = ["0x2f435428", "0x17d8f49b", "0x1aa2e641"];
async function supportsTLD_default({ getOwner, provider }, name) {
  try {
    const labels = name.split(".");
    const tld = labels[labels.length - 1];
    if (tld === "eth")
      return true;
    const tldOwner = await getOwner(tld, { contract: "registry" });
    if (!tldOwner?.owner)
      return false;
    const dnsRegistrar = DNSRegistrar__factory.connect(
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
export {
  supportsTLD_default as default
};
