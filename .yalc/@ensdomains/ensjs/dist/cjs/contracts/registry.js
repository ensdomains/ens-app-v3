"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENSRegistry__factory_1 = require("../generated/factories/ENSRegistry__factory");
exports.default = (provider, address) => ENSRegistry__factory_1.ENSRegistry__factory.connect(address, provider);
