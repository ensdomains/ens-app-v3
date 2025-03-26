import { generateFunction, } from '../../utils/generateFunction.js';
import _getAddr, {} from './_getAddr.js';
import universalWrapper from './universalWrapper.js';
const encode = (client, { name, coin, gatewayUrls, }) => {
    const prData = _getAddr.encode(client, { name, coin });
    return universalWrapper.encode(client, {
        name,
        data: prData.data,
        gatewayUrls,
    });
};
const decode = async (client, data, passthrough, { coin, strict, gatewayUrls, }) => {
    const urData = await universalWrapper.decode(client, data, passthrough, {
        strict,
        gatewayUrls,
    });
    if (!urData)
        return null;
    return _getAddr.decode(client, urData.data, { coin, strict });
};
/**
 * Gets an address record for a name and specified coin
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetAddressRecordParameters}
 * @returns Coin value object, or `null` if not found. {@link GetAddressRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getAddressRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getAddressRecord(client, { name: 'ens.eth', coin: 'ETH' })
 * // { id: 60, name: 'ETH , value: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7' }
 */
const getAddressRecord = generateFunction({ encode, decode });
export default getAddressRecord;
//# sourceMappingURL=getAddressRecord.js.map