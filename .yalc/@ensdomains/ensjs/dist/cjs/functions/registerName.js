"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registerHelpers_1 = require("../utils/registerHelpers");
async function default_1({ contracts }, name, { resolverAddress, value, ...params }) {
    const labels = name.split('.');
    if (labels.length !== 2 || labels[1] !== 'eth')
        throw new Error('Currently only .eth TLD registrations are supported');
    const controller = await contracts.getEthRegistrarController();
    const _resolver = await contracts.getPublicResolver(undefined, resolverAddress);
    const generatedParams = (0, registerHelpers_1.makeRegistrationData)({
        name,
        resolver: _resolver,
        ...params,
    });
    return controller.populateTransaction.register(...generatedParams, {
        value,
    });
}
exports.default = default_1;
