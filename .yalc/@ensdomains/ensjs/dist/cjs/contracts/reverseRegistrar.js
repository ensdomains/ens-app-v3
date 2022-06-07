"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReverseRegistrar__factory_1 = require("../generated/factories/ReverseRegistrar__factory");
const defaultAddress = '0x4696E2f7D9f4CA187155ff50D93C00172181ddd5';
exports.default = (provider, address) => ReverseRegistrar__factory_1.ReverseRegistrar__factory.connect(address || defaultAddress, provider);
