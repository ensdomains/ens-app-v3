"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UniversalResolver__factory_1 = require("../generated/factories/UniversalResolver__factory");
exports.default = (provider, address) => UniversalResolver__factory_1.UniversalResolver__factory.connect(address, provider);
