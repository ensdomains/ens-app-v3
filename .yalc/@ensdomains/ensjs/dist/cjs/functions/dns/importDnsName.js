"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const dnsRegistrar_js_1 = require("../../contracts/dnsRegistrar.js");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const general_js_1 = require("../../errors/general.js");
const hexEncodedName_js_1 = require("../../utils/hexEncodedName.js");
const makeFunctionData = (wallet, { name, dnsImportData, address, resolverAddress, }) => {
    const data = dnsImportData.rrsets.map((rrset) => ({
        rrset: (0, viem_1.bytesToHex)(rrset.rrset),
        sig: (0, viem_1.bytesToHex)(rrset.sig),
    }));
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
                args: [hexEncodedName, data, (0, viem_1.bytesToHex)(dnsImportData.proof)],
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
            args: [
                hexEncodedName,
                data,
                (0, viem_1.bytesToHex)(dnsImportData.proof),
                resolverAddress_,
                address,
            ],
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
    return wallet.sendTransaction(writeArgs);
}
importDnsName.makeFunctionData = exports.makeFunctionData;
exports.default = importDnsName;
//# sourceMappingURL=importDnsName.js.map