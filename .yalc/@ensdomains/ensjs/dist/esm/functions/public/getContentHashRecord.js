import { generateFunction, } from '../../utils/generateFunction.js';
import _getContentHash, {} from './_getContentHash.js';
import universalWrapper from './universalWrapper.js';
const encode = (client, { name, gatewayUrls }) => {
    const prData = _getContentHash.encode(client, { name });
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
    return _getContentHash.decode(client, urData.data, { strict });
};
/**
 * Gets the content hash record for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetContentHashRecordParameters}
 * @returns Content hash object, or `null` if not found. {@link GetContentHashRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getContentHashRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getContentHashRecord(client, { name: 'ens.eth' })
 * // { protocolType: 'ipfs', decoded: 'k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw' }
 */
const getContentHashRecord = generateFunction({ encode, decode });
export default getContentHashRecord;
//# sourceMappingURL=getContentHashRecord.js.map