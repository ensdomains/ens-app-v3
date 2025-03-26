import { sendTransaction } from 'viem/actions';
import { encodeClearRecords } from '../../utils/encoders/encodeClearRecords.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (_wallet, { name, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: encodeClearRecords(namehash(name)),
    };
};
/**
 * Clears the records for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link ClearRecordsParameters}
 * @returns Transaction hash. {@link ClearRecordsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { clearRecords } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await clearRecords(wallet, {
 *   name: 'ens.eth',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function clearRecords(wallet, { name, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
clearRecords.makeFunctionData = makeFunctionData;
export default clearRecords;
//# sourceMappingURL=clearRecords.js.map