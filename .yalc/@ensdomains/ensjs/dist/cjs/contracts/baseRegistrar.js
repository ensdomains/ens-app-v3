"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRegistrarImplementation__factory_1 = require("../generated/factories/BaseRegistrarImplementation__factory");
exports.default = (provider, address) => BaseRegistrarImplementation__factory_1.BaseRegistrarImplementation__factory.connect(address, provider);
