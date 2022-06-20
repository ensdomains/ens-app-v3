"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRegistrarImplementation__factory_1 = require("../generated/factories/BaseRegistrarImplementation__factory");
const defaultAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';
exports.default = (provider, address) => BaseRegistrarImplementation__factory_1.BaseRegistrarImplementation__factory.connect(address || defaultAddress, provider);
