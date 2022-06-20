"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PublicResolver__factory_1 = require("../generated/factories/PublicResolver__factory");
const defaultAddress = '0x9e6c745CAEdA0AB8a7AD0f393ef90dcb7C70074A';
exports.default = (provider, address) => PublicResolver__factory_1.PublicResolver__factory.connect(address || defaultAddress, provider);
