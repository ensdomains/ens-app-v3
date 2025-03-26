import { decodeFunctionResult, encodeFunctionData } from 'viem';
import { publicResolverContenthashSnippet } from '../../contracts/publicResolver.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
import { decodeContentHash, } from '../../utils/contentHash.js';
import { generateFunction } from '../../utils/generateFunction.js';
import { namehash } from '../../utils/normalise.js';
const encode = (_client, { name }) => {
    return {
        to: EMPTY_ADDRESS,
        data: encodeFunctionData({
            abi: publicResolverContenthashSnippet,
            functionName: 'contenthash',
            args: [namehash(name)],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const response = decodeFunctionResult({
            abi: publicResolverContenthashSnippet,
            functionName: 'contenthash',
            data,
        });
        return decodeContentHash(response);
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getContentHash = generateFunction({ encode, decode });
export default _getContentHash;
//# sourceMappingURL=_getContentHash.js.map