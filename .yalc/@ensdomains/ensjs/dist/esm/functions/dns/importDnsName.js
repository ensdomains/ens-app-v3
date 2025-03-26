import { encodeFunctionData, toHex, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { dnsRegistrarProveAndClaimSnippet, dnsRegistrarProveAndClaimWithResolverSnippet, } from '../../contracts/dnsRegistrar.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { AdditionalParameterSpecifiedError } from '../../errors/general.js';
import { packetToBytes } from '../../utils/hexEncodedName.js';
export const makeFunctionData = (wallet, { name, dnsImportData, address, resolverAddress, }) => {
    const hexEncodedName = toHex(packetToBytes(name));
    const dnsRegistrarAddress = getChainContractAddress({
        client: wallet,
        contract: 'ensDnsRegistrar',
    });
    if (!address) {
        if (resolverAddress)
            throw new AdditionalParameterSpecifiedError({
                parameter: 'resolverAddress',
                allowedParameters: ['name', 'dnsImportData'],
                details: 'resolverAddress cannot be specified when claiming without an address',
            });
        return {
            to: dnsRegistrarAddress,
            data: encodeFunctionData({
                abi: dnsRegistrarProveAndClaimSnippet,
                functionName: 'proveAndClaim',
                args: [hexEncodedName, dnsImportData],
            }),
        };
    }
    const resolverAddress_ = resolverAddress ||
        getChainContractAddress({ client: wallet, contract: 'ensPublicResolver' });
    return {
        to: dnsRegistrarAddress,
        data: encodeFunctionData({
            abi: dnsRegistrarProveAndClaimWithResolverSnippet,
            functionName: 'proveAndClaimWithResolver',
            args: [hexEncodedName, dnsImportData, resolverAddress_, address],
        }),
    };
};
/**
 * Creates a transaction to import a DNS name to ENS.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link ImportDnsNameParameters}
 * @returns A transaction hash. {@link ImportDnsNameReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getDnsImportData, importDnsName } from '@ensdomains/ensjs/dns'
 *
 * const mainnetWithEns = addEnsContracts(mainnet)
 * const client = createPublicClient({
 *   chain: mainnetWithEns,
 *   transport: http(),
 * })
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const dnsImportData = await getDnsImportData(client, {
 *   name: 'example.com',
 * })
 * const hash = await importDnsName(wallet, {
 *   name: 'example.com',
 *   dnsImportData,
 * })
 */
async function importDnsName(wallet, { name, address, dnsImportData, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        address,
        dnsImportData,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
importDnsName.makeFunctionData = makeFunctionData;
export default importDnsName;
//# sourceMappingURL=importDnsName.js.map