import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { bulkRenewalRenewAllSnippet } from '../../contracts/bulkRenewal.js';
import { ethRegistrarControllerRenewSnippet } from '../../contracts/ethRegistrarController.js';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { UnsupportedNameTypeError } from '../../errors/general.js';
import { getNameType } from '../../utils/getNameType.js';
export const makeFunctionData = (wallet, { nameOrNames, duration, value }) => {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    const labels = names.map((name) => {
        const label = name.split('.');
        const nameType = getNameType(name);
        if (nameType !== 'eth-2ld')
            throw new UnsupportedNameTypeError({
                nameType,
                supportedNameTypes: ['eth-2ld'],
                details: 'Only 2ld-eth renewals are currently supported',
            });
        return label[0];
    });
    if (labels.length === 1) {
        return {
            to: getChainContractAddress({
                client: wallet,
                contract: 'ensEthRegistrarController',
            }),
            data: encodeFunctionData({
                abi: ethRegistrarControllerRenewSnippet,
                functionName: 'renew',
                args: [labels[0], BigInt(duration)],
            }),
            value,
        };
    }
    return {
        to: getChainContractAddress({
            client: wallet,
            contract: 'ensBulkRenewal',
        }),
        data: encodeFunctionData({
            abi: bulkRenewalRenewAllSnippet,
            functionName: 'renewAll',
            args: [labels, BigInt(duration)],
        }),
        value,
    };
};
/**
 * Renews a name or names for a specified duration.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link RenewNamesParameters}
 * @returns Transaction hash. {@link RenewNamesReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 * import { renewNames } from '@ensdomains/ensjs/wallet'
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
 *
 * const duration = 31536000 // 1 year
 * const { base, premium } = await getPrice(wallet, {
 *  nameOrNames: 'example.eth',
 *  duration,
 * })
 * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
 * const hash = await renewNames(wallet, {
 *   nameOrNames: 'example.eth',
 *   duration,
 *   value,
 * })
 * // 0x...
 */
async function renewNames(wallet, { nameOrNames, duration, value, ...txArgs }) {
    const data = makeFunctionData(wallet, { nameOrNames, duration, value });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
renewNames.makeFunctionData = makeFunctionData;
export default renewNames;
//# sourceMappingURL=renewNames.js.map