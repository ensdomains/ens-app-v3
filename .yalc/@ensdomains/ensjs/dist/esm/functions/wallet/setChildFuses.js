import { encodeFunctionData, labelhash, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { nameWrapperSetChildFusesSnippet } from '../../contracts/nameWrapper.js';
import { encodeFuses } from '../../utils/fuses.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (wallet, { name, fuses, expiry }) => {
    const encodedFuses = encodeFuses({ input: fuses });
    const labels = name.split('.');
    const labelHash = labelhash(labels.shift());
    const parentNode = namehash(labels.join('.'));
    return {
        to: getChainContractAddress({ client: wallet, contract: 'ensNameWrapper' }),
        data: encodeFunctionData({
            abi: nameWrapperSetChildFusesSnippet,
            functionName: 'setChildFuses',
            args: [parentNode, labelHash, encodedFuses, BigInt(expiry ?? 0)],
        }),
    };
};
/**
 * Sets the fuses for a name as the parent.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetChildFusesParameters}
 * @returns Transaction hash. {@link SetChildFusesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setChildFuses } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setChildFuses(wallet, {
 *   name: 'sub.ens.eth',
 *   fuses: {
 *     parent: {
 *       named: ['PARENT_CANNOT_CONTROl'],
 *     },
 *   },
 * })
 * // 0x...
 */
async function setChildFuses(wallet, { name, fuses, expiry, ...txArgs }) {
    const data = makeFunctionData(wallet, { name, fuses, expiry });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setChildFuses.makeFunctionData = makeFunctionData;
export default setChildFuses;
//# sourceMappingURL=setChildFuses.js.map