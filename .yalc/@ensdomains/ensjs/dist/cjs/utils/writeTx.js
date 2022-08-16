"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (signer, populate) => (tx) => populate ? tx : signer.sendTransaction(tx);
