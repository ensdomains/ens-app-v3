"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PublicResolver__factory_1 = require("../generated/factories/PublicResolver__factory");
const defaultAddress = '0x3bAa5F3ea7bFCC8948c4140f233d72c11eBF0bdB';
exports.default = (provider, address) => PublicResolver__factory_1.PublicResolver__factory.connect(address || defaultAddress, provider);
