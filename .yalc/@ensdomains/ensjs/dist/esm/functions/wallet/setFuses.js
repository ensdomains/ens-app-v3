import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperSetFusesSnippet } from '../../contracts/nameWrapper.js';
import { encodeFuses, } from '../../utils/fuses.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (wallet, { name, fuses }) => {
    const encodedFuses = encodeFuses({ restriction: 'child', input: fuses });
    return {
        to: getChainContractAddress({ client: wallet, contract: 'ensNameWrapper' }),
        data: encodeFunctionData({
            abi: nameWrapperSetFusesSnippet,
            functionName: 'setFuses',
            args: [namehash(name), encodedFuses],
        }),
    };
};
/**
 * Sets the fuses for a name.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetFusesParameters}
 * @returns Transaction hash. {@link SetFusesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setFuses } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setFuses(wallet, {
 *   name: 'sub.ens.eth',
 *   fuses: {
 *     named: ['CANNOT_TRANSFER'],
 *   },
 * })
 * // 0x...
 */
async function setFuses(wallet, { name, fuses, ...txArgs }) {
    const data = makeFunctionData(wallet, { name, fuses });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setFuses.makeFunctionData = makeFunctionData;
export default setFuses;
//# sourceMappingURL=setFuses.js.map