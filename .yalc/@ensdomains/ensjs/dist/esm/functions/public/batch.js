import { FunctionNotBatchableError } from '../../errors/public.js';
import { generateFunction, } from '../../utils/generateFunction.js';
import multicallWrapper from './multicallWrapper.js';
const encode = (client, ...items) => {
    const rawDataArr = items.map(({ args, encode: encodeRef }, i) => {
        if (!encodeRef)
            throw new FunctionNotBatchableError({ functionIndex: i });
        return encodeRef(client, ...args);
    });
    const response = multicallWrapper.encode(client, {
        transactions: rawDataArr,
    });
    return { ...response, passthrough: rawDataArr };
};
const decode = async (client, data, passthrough, ...items) => {
    const response = await multicallWrapper.decode(client, data, passthrough);
    if (!response)
        throw new Error('No response from multicall');
    return Promise.all(response.map((ret, i) => {
        if (passthrough[i].passthrough) {
            return items[i].decode(client, ret.returnData, passthrough[i].passthrough, ...items[i].args);
        }
        return items[i].decode(client, ret.returnData, ...items[i].args);
    }));
};
/**
 * Batches multiple read functions into a single call.
 * @param client - {@link ClientWithEns}
 * @param ...parameters - Array of {@link BatchFunctionResult} objects
 * @returns Array of return values from each function
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { batch, getTextRecord, getAddressRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await batch(
 *   client,
 *   getTextRecord.batch({ name: 'ens.eth', key: 'com.twitter' }),
 *   getAddressRecord.batch({ name: 'ens.eth', coin: 'ETH' }),
 * )
 * // ['ensdomains', { id: 60, name: 'ETH', value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7 }]
 */
const batch = generateFunction({
    encode,
    decode,
});
export default batch;
//# sourceMappingURL=batch.js.map