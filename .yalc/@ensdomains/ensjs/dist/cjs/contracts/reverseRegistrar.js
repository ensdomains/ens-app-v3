"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReverseRegistrar__factory_1 = require("../generated/factories/ReverseRegistrar__factory");
exports.default = (provider, address) => ReverseRegistrar__factory_1.ReverseRegistrar__factory.connect(address, provider);
