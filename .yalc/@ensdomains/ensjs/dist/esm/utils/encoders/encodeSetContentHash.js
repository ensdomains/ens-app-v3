import { encodeFunctionData } from 'viem';
import { publicResolverSetContenthashSnippet } from '../../contracts/publicResolver.js';
import { encodeContentHash } from '../contentHash.js';
export const encodeSetContentHash = ({ namehash, contentHash, }) => {
    let encodedHash = '0x';
    if (contentHash) {
        encodedHash = encodeContentHash(contentHash);
    }
    return encodeFunctionData({
        abi: publicResolverSetContenthashSnippet,
        functionName: 'setContenthash',
        args: [namehash, encodedHash],
    });
};
//# sourceMappingURL=encodeSetContentHash.js.map