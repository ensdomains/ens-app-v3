import { sendTransaction } from 'viem/actions';
import { encodeSetText } from '../../utils/encoders/encodeSetText.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (_wallet, { name, key, value, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: encodeSetText({ namehash: namehash(name), key, value }),
    };
};
/**
 * Sets a text record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetTextRecordParameters}
 * @returns Transaction hash. {@link SetTextRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setTextRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setTextRecord(wallet, {
 *   name: 'ens.eth',
 *   key: 'foo',
 *   value: 'bar',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setTextRecord(wallet, { name, key, value, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        key,
        value,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setTextRecord.makeFunctionData = makeFunctionData;
export default setTextRecord;
//# sourceMappingURL=setTextRecord.js.map