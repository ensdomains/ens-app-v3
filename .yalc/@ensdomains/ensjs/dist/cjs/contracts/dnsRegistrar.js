"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DNSRegistrar__factory_1 = require("../generated/factories/DNSRegistrar__factory");
exports.default = (provider, address) => DNSRegistrar__factory_1.DNSRegistrar__factory.connect(address, provider);
