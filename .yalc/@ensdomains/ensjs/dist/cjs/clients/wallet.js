"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsWalletClient = void 0;
const viem_1 = require("viem");
const addEnsContracts_js_1 = require("../contracts/addEnsContracts.js");
const wallet_js_1 = require("./decorators/wallet.js");
const createEnsWalletClient = ({ account, chain, key = 'ensWallet', name = 'ENS Wallet Client', transport, pollingInterval, }) => {
    return (0, viem_1.createWalletClient)({
        account,
        chain: (0, addEnsContracts_js_1.addEnsContracts)(chain),
        key,
        name,
        pollingInterval,
        transport,
    }).extend(wallet_js_1.ensWalletActions);
};
exports.createEnsWalletClient = createEnsWalletClient;
//# sourceMappingURL=wallet.js.map