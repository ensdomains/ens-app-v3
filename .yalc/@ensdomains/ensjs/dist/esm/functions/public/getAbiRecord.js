import { generateFunction, } from '../../utils/generateFunction.js';
import _getAbi, {} from './_getAbi.js';
import universalWrapper from './universalWrapper.js';
const encode = (client, { name, supportedContentTypes, gatewayUrls, }) => {
    const prData = _getAbi.encode(client, { name, supportedContentTypes });
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
    return _getAbi.decode(client, urData.data, { strict });
};
/**
 * Gets the ABI record for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAbiRecordParameters}
 * @returns ABI record for the name, or `null` if not found. {@link GetAbiRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAbiRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAbiRecord(client, { name: 'ens.eth' })
 * // TODO: real example
 */
const getAbiRecord = generateFunction({ encode, decode });
export default getAbiRecord;
//# sourceMappingURL=getAbiRecord.js.map