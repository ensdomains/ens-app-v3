"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const dnsRegistrar_js_1 = require("../../contracts/dnsRegistrar.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const general_js_1 = require("../../errors/general.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const makeFunctionData = (wallet, { name, dnsImportData, address, resolverAddress, }) => {
    const hexEncodedName = (0, viem_1.toHex)((0, hexEncodedName_js_1.packetToBytes)(name));
    const dnsRegistrarAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
        client: wallet,
        contract: 'ensDnsRegistrar',
    });
    if (!address) {
        if (resolverAddress)
            throw new general_js_1.AdditionalParameterSpecifiedError({
                parameter: 'resolverAddress',
                allowedParameters: ['name', 'dnsImportData'],
                details: 'resolverAddress cannot be specified when claiming without an address',
            });
        return {
            to: dnsRegistrarAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: dnsRegistrar_js_1.dnsRegistrarProveAndClaimSnippet,
                functionName: 'proveAndClaim',
                args: [hexEncodedName, dnsImportData],
            }),
        };
    }
    const resolverAddress_ = resolverAddress ||
        (0, getChainContractAddress_js_1.getChainContractAddress)({ client: wallet, contract: 'ensPublicResolver' });
    return {
        to: dnsRegistrarAddress,
        data: (0, viem_1.encodeFunctionData)({
            abi: dnsRegistrar_js_1.dnsRegistrarProveAndClaimWithResolverSnippet,
            functionName: 'proveAndClaimWithResolver',
            args: [hexEncodedName, dnsImportData, resolverAddress_, address],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function importDnsName(wallet, { name, address, dnsImportData, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        address,
        dnsImportData,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
importDnsName.makeFunctionData = exports.makeFunctionData;
exports.default = importDnsName;
//# sourceMappingURL=importDnsName.js.map