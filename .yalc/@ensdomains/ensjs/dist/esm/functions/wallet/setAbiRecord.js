import { sendTransaction } from 'viem/actions';
import { encodeSetAbi, } from '../../utils/encoders/encodeSetAbi.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (_wallet, { name, encodedAbi, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: encodeSetAbi({
            namehash: namehash(name),
            ...encodedAbi,
        }),
    };
};
/**
 * Sets the ABI for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetAbiRecordParameters}
 * @returns Transaction hash. {@link SetAbiRecordReturnType}
 *
 * @example
 * import abi from './abi.json'
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { encodeAbi } from '@ensdomains/ensjs/utils'
 * import { setAbiRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 *
 * const encodedAbi = await encodeAbi({ encodeAs: 'json', abi })
 * const hash = await setAbiRecord(wallet, {
 *   name: 'ens.eth',
 *   encodedAbi,
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setAbiRecord(wallet, { name, encodedAbi, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        encodedAbi,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setAbiRecord.makeFunctionData = makeFunctionData;
export default setAbiRecord;
//# sourceMappingURL=setAbiRecord.js.map