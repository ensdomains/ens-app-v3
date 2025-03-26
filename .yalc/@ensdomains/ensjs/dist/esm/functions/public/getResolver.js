import { BaseError, decodeFunctionResult, encodeFunctionData, getContractError, toHex, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { universalResolverFindResolverSnippet } from '../../contracts/universalResolver.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
import { generateFunction, } from '../../utils/generateFunction.js';
import { packetToBytes } from '../../utils/hexEncodedName.js';
const encode = (client, { name }) => {
    const address = getChainContractAddress({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [toHex(packetToBytes(name))];
    return {
        to: address,
        data: encodeFunctionData({
            abi: universalResolverFindResolverSnippet,
            functionName: 'findResolver',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw getContractError(data, {
            abi: universalResolverFindResolverSnippet,
            functionName: 'findResolver',
            args: passthrough.args,
            address: passthrough.address,
        });
    const response = decodeFunctionResult({
        abi: universalResolverFindResolverSnippet,
        functionName: 'findResolver',
        data,
    });
    if (response[0] === EMPTY_ADDRESS)
        return null;
    return response[0];
};
/**
 * Gets the resolver address for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetResolverParameters}
 * @returns Resolver address, or null if none is found. {@link GetResolverReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getResolver } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getResolver(client, { name: 'ens.eth' })
 * // 0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41
 */
const getResolver = generateFunction({ encode, decode });
export default getResolver;
//# sourceMappingURL=getResolver.js.map