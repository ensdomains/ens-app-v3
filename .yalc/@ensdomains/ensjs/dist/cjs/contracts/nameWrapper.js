"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NameWrapper__factory_1 = require("../generated/factories/NameWrapper__factory");
const defaultAddress = '0xD7D9C568Bc4C2343ab286096e1F851D33eEf49Af';
exports.default = (provider, address) => NameWrapper__factory_1.NameWrapper__factory.connect(address || defaultAddress, provider);
