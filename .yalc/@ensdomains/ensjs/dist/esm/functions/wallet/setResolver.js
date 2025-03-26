import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperSetResolverSnippet } from '../../contracts/nameWrapper.js';
import { registrySetResolverSnippet } from '../../contracts/registry.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (wallet, { name, contract, resolverAddress }) => {
    if (contract !== 'registry' && contract !== 'nameWrapper')
        throw new Error(`Unknown contract: ${contract}`);
    const to = getChainContractAddress({
        client: wallet,
        contract: contract === 'nameWrapper' ? 'ensNameWrapper' : 'ensRegistry',
    });
    const args = [namehash(name), resolverAddress];
    const functionName = 'setResolver';
    if (contract === 'nameWrapper')
        return {
            to,
            data: encodeFunctionData({
                abi: nameWrapperSetResolverSnippet,
                functionName,
                args,
            }),
        };
    return {
        to,
        data: encodeFunctionData({
            abi: registrySetResolverSnippet,
            functionName,
            args,
        }),
    };
};
/**
 * Sets a resolver for a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetResolverParameters}
 * @returns Transaction hash. {@link SetResolverReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setResolver } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setResolver(wallet, {
 *   name: 'ens.eth',
 *   contract: 'registry',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setResolver(wallet, { name, contract, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, { name, contract, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setResolver.makeFunctionData = makeFunctionData;
export default setResolver;
//# sourceMappingURL=setResolver.js.map