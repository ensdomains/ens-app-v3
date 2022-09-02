"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerHelpers_1 = require("../utils/registerHelpers");
async function default_1({ contracts }, name, { resolverAddress, ...params }) {
    const labels = name.split('.');
    if (labels.length !== 2 || labels[1] !== 'eth')
        throw new Error('Currently only .eth TLD registrations are supported');
    const controller = await contracts.getEthRegistrarController();
    const resolver = await contracts.getPublicResolver(undefined, resolverAddress);
    const { secret, commitment, wrapperExpiry } = (0, registerHelpers_1.makeCommitment)({
        name,
        resolver,
        ...params,
    });
    return {
        ...(await controller.populateTransaction.commit(commitment)),
        customData: {
            secret,
            commitment,
            wrapperExpiry,
        },
    };
}
exports.default = default_1;
