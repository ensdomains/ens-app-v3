"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1({ contracts }, name, { duration, value, }) {
    const labels = name.split('.');
    if (labels.length !== 2 || labels[1] !== 'eth')
        throw new Error('Currently only .eth TLD renewals are supported');
    const controller = await contracts.getEthRegistrarController();
    return controller.populateTransaction.renew(labels[0], duration, { value });
}
exports.default = default_1;
