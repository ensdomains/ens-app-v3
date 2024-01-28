import { decodeFunctionResult, encodeFunctionData } from 'viem';
import { publicResolverTextSnippet } from '../../contracts/publicResolver.js';
import { EMPTY_ADDRESS } from '../../utils/consts.js';
import { generateFunction } from '../../utils/generateFunction.js';
import { namehash } from '../../utils/normalise.js';
const encode = (_client, { name, key }) => {
    return {
        to: EMPTY_ADDRESS,
        data: encodeFunctionData({
            abi: publicResolverTextSnippet,
            functionName: 'text',
            args: [namehash(name), key],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const response = decodeFunctionResult({
            abi: publicResolverTextSnippet,
            functionName: 'text',
            data,
        });
        if (!response)
            return null;
        return response;
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getText = generateFunction({ encode, decode });
export default _getText;
//# sourceMappingURL=_getText.js.map