// src/contracts/bulkRenewal.ts
import { BulkRenewal__factory } from "../generated/factories/BulkRenewal__factory.mjs";
var bulkRenewal_default = (provider, address) => BulkRenewal__factory.connect(address, provider);
export {
  bulkRenewal_default as default
};
