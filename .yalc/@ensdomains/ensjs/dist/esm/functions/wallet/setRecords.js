import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { publicResolverMulticallSnippet } from '../../contracts/publicResolver.js';
import { NoRecordsSpecifiedError } from '../../errors/public.js';
import { generateRecordCallArray, } from '../../utils/generateRecordCallArray.js';
import { namehash } from '../../utils/normalise.js';
export const makeFunctionData = (_wallet, { name, resolverAddress, ...records }) => {
    const callArray = generateRecordCallArray({
        namehash: namehash(name),
        ...records,
    });
    if (callArray.length === 0)
        throw new NoRecordsSpecifiedError();
    if (callArray.length === 1)
        return {
            to: resolverAddress,
            data: callArray[0],
        };
    return {
        to: resolverAddress,
        data: encodeFunctionData({
            abi: publicResolverMulticallSnippet,
            functionName: 'multicall',
            args: [callArray],
        }),
    };
};
/**
 * Sets multiple records for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetRecordsParameters}
 * @returns Transaction hash. {@link SetRecordsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setRecords } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setRecords(wallet, {
 *   name: 'ens.eth',
 *   coins: [
 *     {
 *       coin: 'ETH',
 *       value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *     },
 *   ],
 *   texts: [{ key: 'foo', value: 'bar' }],
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setRecords(wallet, { name, resolverAddress, clearRecords, contentHash, texts, coins, abi, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        resolverAddress,
        clearRecords,
        contentHash,
        texts,
        coins,
        abi,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
setRecords.makeFunctionData = makeFunctionData;
export default setRecords;
//# sourceMappingURL=setRecords.js.map