"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexEncodeName = void 0;
const dns_packet_1 = __importDefault(require("dns-packet"));
const hexEncodeName = (name) => `0x${dns_packet_1.default.name.encode(name).toString('hex')}`;
exports.hexEncodeName = hexEncodeName;
