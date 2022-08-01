"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DoNotCallOnChainUniversalResolverProxy__factory_1 = require("../generated/factories/DoNotCallOnChainUniversalResolverProxy__factory");
exports.default = (provider, address) => DoNotCallOnChainUniversalResolverProxy__factory_1.DoNotCallOnChainUniversalResolverProxy__factory.connect(address, provider);
