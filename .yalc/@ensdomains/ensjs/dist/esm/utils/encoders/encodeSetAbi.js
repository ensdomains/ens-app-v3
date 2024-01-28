import { encodeFunctionData } from 'viem';
import { publicResolverSetAbiSnippet } from '../../contracts/publicResolver.js';
export const encodeSetAbi = ({ namehash, contentType, encodedData, }) => {
    return encodeFunctionData({
        abi: publicResolverSetAbiSnippet,
        functionName: 'setABI',
        args: [namehash, BigInt(contentType), encodedData],
    });
};
//# sourceMappingURL=encodeSetAbi.js.map