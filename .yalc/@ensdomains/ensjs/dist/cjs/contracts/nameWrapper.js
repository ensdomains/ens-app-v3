"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NameWrapper__factory_1 = require("../generated/factories/NameWrapper__factory");
const defaultAddress = '0xD678D5259862431F17a556515948D450B5934773';
exports.default = (provider, address) => NameWrapper__factory_1.NameWrapper__factory.connect(address || defaultAddress, provider);
