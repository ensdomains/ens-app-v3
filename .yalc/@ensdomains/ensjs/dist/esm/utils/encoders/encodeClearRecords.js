import { encodeFunctionData } from 'viem';
import { publicResolverClearRecordsSnippet } from '../../contracts/publicResolver.js';
export const encodeClearRecords = (namehash) => encodeFunctionData({
    abi: publicResolverClearRecordsSnippet,
    functionName: 'clearRecords',
    args: [namehash],
});
//# sourceMappingURL=encodeClearRecords.js.map