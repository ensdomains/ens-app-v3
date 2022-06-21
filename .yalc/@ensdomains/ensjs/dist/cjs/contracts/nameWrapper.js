"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NameWrapper__factory_1 = require("../generated/factories/NameWrapper__factory");
exports.default = (provider, address) => NameWrapper__factory_1.NameWrapper__factory.connect(address, provider);
