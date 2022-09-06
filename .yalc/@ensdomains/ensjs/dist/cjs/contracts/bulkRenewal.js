"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BulkRenewal__factory_1 = require("../generated/factories/BulkRenewal__factory");
// Use a higher-order function to overide the address that is passed in from getContractAddress()
exports.default = (address) => (provider) => BulkRenewal__factory_1.BulkRenewal__factory.connect(address, provider);
