"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PublicResolver__factory_1 = require("../generated/factories/PublicResolver__factory");
exports.default = (provider, address) => PublicResolver__factory_1.PublicResolver__factory.connect(address, provider);
