import { sendTransaction } from 'viem/actions';
import { encodeSetContentHash } from '../../utils/encoders/encodeSetContentHash.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (_wallet, { name, contentHash, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: encodeSetContentHash({ namehash: namehash(name), contentHash }),
    };
};
/**
 * Sets the content hash record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetContentHashRecordParameters}
 * @returns Transaction hash. {@link SetContentHashRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setContentHashRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setContentHashRecord(wallet, {
 *   name: 'ens.eth',
 *   value: 'ipns://k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setContentHashRecord(wallet, { name, contentHash, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        contentHash,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setContentHashRecord.makeFunctionData = makeFunctionData;
export default setContentHashRecord;
//# sourceMappingURL=setContentHashRecord.js.map