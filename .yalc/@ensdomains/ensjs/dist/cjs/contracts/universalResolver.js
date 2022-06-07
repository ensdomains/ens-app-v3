"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UniversalResolver__factory_1 = require("../generated/factories/UniversalResolver__factory");
const defaultAddress = '0xAbCd01ddDa102B0C32e8C5a371D7480dFA559DC3';
exports.default = (provider, address) => UniversalResolver__factory_1.UniversalResolver__factory.connect(address || defaultAddress, provider);
