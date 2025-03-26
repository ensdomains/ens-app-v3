import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { parseAccount } from 'viem/utils';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { reverseRegistrarSetNameForAddrSnippet, reverseRegistrarSetNameSnippet, } from '../../contracts/reverseRegistrar.js';
export const makeFunctionData = (wallet, { name, address, resolverAddress = getChainContractAddress({
    client: wallet,
    contract: 'ensPublicResolver',
}), }) => {
    const reverseRegistrarAddress = getChainContractAddress({
        client: wallet,
        contract: 'ensReverseRegistrar',
    });
    if (address) {
        return {
            to: reverseRegistrarAddress,
            data: encodeFunctionData({
                abi: reverseRegistrarSetNameForAddrSnippet,
                functionName: 'setNameForAddr',
                args: [
                    address,
                    wallet.account.address,
                    resolverAddress ||
                        getChainContractAddress({
                            client: wallet,
                            contract: 'ensPublicResolver',
                        }),
                    name,
                ],
            }),
        };
    }
    return {
        to: reverseRegistrarAddress,
        data: encodeFunctionData({
            abi: reverseRegistrarSetNameSnippet,
            functionName: 'setName',
            args: [name],
        }),
    };
};
/**
 * Sets a primary name for an address.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetPrimaryNameParameters}
 * @returns Transaction hash. {@link SetPrimaryNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setPrimaryName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setPrimaryName(wallet, {
 *   name: 'ens.eth',
 * })
 * // 0x...
 */
async function setPrimaryName(wallet, { name, address, resolverAddress, ...txArgs }) {
    const data = makeFunctionData({
        ...wallet,
        account: parseAccount((txArgs.account || wallet.account)),
    }, { name, address, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setPrimaryName.makeFunctionData = makeFunctionData;
export default setPrimaryName;
//# sourceMappingURL=setPrimaryName.js.map