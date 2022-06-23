"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ETHRegistrarController__factory_1 = require("../generated/factories/ETHRegistrarController__factory");
exports.default = (provider, address) => ETHRegistrarController__factory_1.ETHRegistrarController__factory.connect(address, provider);
