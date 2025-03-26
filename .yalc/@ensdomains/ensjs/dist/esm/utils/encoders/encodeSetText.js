import { encodeFunctionData } from 'viem';
import { publicResolverSetTextSnippet } from '../../contracts/publicResolver.js';
export const encodeSetText = ({ namehash, key, value, }) => {
    return encodeFunctionData({
        abi: publicResolverSetTextSnippet,
        functionName: 'setText',
        args: [namehash, key, value ?? ''],
    });
};
//# sourceMappingURL=encodeSetText.js.map