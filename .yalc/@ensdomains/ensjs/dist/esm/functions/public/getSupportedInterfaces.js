import { BaseError, encodeFunctionData, padHex, } from 'viem';
import { erc165SupportsInterfaceSnippet } from '../../contracts/erc165.js';
import { generateFunction } from '../../utils/generateFunction.js';
import multicallWrapper from './multicallWrapper.js';
const encodeInterface = (interfaceId) => encodeFunctionData({
    abi: erc165SupportsInterfaceSnippet,
    functionName: 'supportsInterface',
    args: [interfaceId],
});
const encode = (client, { address, interfaces }) => {
    const calls = interfaces.map((interfaceId) => ({
        to: address,
        data: encodeInterface(interfaceId),
    }));
    const encoded = multicallWrapper.encode(client, {
        transactions: calls,
    });
    return {
        ...encoded,
        passthrough: calls,
    };
};
const decode = async (client, data, passthrough) => {
    if (typeof data === 'object')
        throw data;
    const result = await multicallWrapper.decode(client, data, passthrough);
    return result.map((r) => r.success && r.returnData === padHex('0x01'));
};
/**
 * Gets the supported interfaces for any contract address.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetSupportedInterfacesParameters}
 * @returns Array of booleans matching the input array {@link GetSupportedInterfacesReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getSupportedInterfaces } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getSupportedInterfaces(client, {
 *   address: '0x58774Bb8acD458A640aF0B88238369A167546ef2',
 *   interfaces: ['0x2f435428', '0x23b872dd'],
 * })
 * // [true, false]
 */
const getSupportedInterfaces = generateFunction({ encode, decode });
export default getSupportedInterfaces;
//# sourceMappingURL=getSupportedInterfaces.js.map