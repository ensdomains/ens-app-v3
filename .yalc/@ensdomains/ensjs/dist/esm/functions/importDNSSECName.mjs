// src/functions/importDNSSECName.ts
import { Oracle as NewOracle } from "@ensdomains/dnssecoraclejs";
import packet from "dns-packet";
import { EMPTY_ADDRESS } from "../utils/consts.mjs";
var DNS_OVER_HTTP_ENDPOINT = "https://1.1.1.1/dns-query";
async function importDNSSECName_default({ contracts, provider }, name, { address, proverResult }) {
  const dnsRegistrarContract = await contracts?.getDNSRegistrar();
  const resolverContract = await contracts?.getPublicResolver();
  const registrarOracle = await dnsRegistrarContract?.oracle();
  if (!registrarOracle) {
    throw new Error("No oracle found");
  }
  const oracle = new NewOracle(registrarOracle, provider);
  const proofData = await oracle.getProofData(proverResult);
  const encodedName = `0x${packet.name.encode(name).toString("hex")}`;
  const data = proofData.rrsets.map(
    (x) => Object.values(x)
  );
  const { proof } = proofData;
  if (address === EMPTY_ADDRESS) {
    return dnsRegistrarContract?.populateTransaction.proveAndClaim(
      encodedName,
      data,
      proof
    );
  }
  if (address) {
    return dnsRegistrarContract?.populateTransaction.proveAndClaimWithResolver(
      encodedName,
      data,
      proof,
      resolverContract.address,
      address
    );
  }
}
export {
  DNS_OVER_HTTP_ENDPOINT,
  importDNSSECName_default as default
};
