"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateFuseInput_1 = __importDefault(require("../utils/generateFuseInput"));
const normalise_1 = require("../utils/normalise");
async function default_1({ contracts, signer }, name, { fusesToBurn, }) {
    const nameWrapper = (await contracts?.getNameWrapper()).connect(signer);
    const hash = (0, normalise_1.namehash)(name);
    const encodedFuses = (0, generateFuseInput_1.default)(fusesToBurn);
    return nameWrapper.burnFuses(hash, encodedFuses);
}
exports.default = default_1;
