import { generateFunction, } from '../../utils/generateFunction.js';
import _getText, {} from './_getText.js';
import universalWrapper from './universalWrapper.js';
const encode = (client, { name, key, gatewayUrls }) => {
    const prData = _getText.encode(client, { name, key });
    return universalWrapper.encode(client, {
        name,
        data: prData.data,
        gatewayUrls,
    });
};
const decode = async (client, data, passthrough, { strict, gatewayUrls, }) => {
    const urData = await universalWrapper.decode(client, data, passthrough, {
        strict,
        gatewayUrls,
    });
    if (!urData)
        return null;
    return _getText.decode(client, urData.data, { strict });
};
/**
 * Gets a text record for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetTextRecordParameters}
 * @returns Text record string, or null if none is found. {@link GetTextRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getTextRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getTextRecord(client, { name: 'ens.eth', key: 'com.twitter' })
 * // ensdomains
 */
const getTextRecord = generateFunction({ encode, decode });
export default getTextRecord;
//# sourceMappingURL=getTextRecord.js.map