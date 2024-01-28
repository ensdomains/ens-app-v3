import { BaseError, decodeFunctionResult, encodeFunctionData, getContractError, offchainLookup, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js';
import { multicallTryAggregateSnippet } from '../../contracts/multicall.js';
import { generateFunction } from '../../utils/generateFunction.js';
const encode = (client, { transactions, requireSuccess = false }) => {
    return {
        to: getChainContractAddress({ client, contract: 'multicall3' }),
        data: encodeFunctionData({
            abi: multicallTryAggregateSnippet,
            functionName: 'tryAggregate',
            args: [
                requireSuccess,
                transactions.map((tx) => ({ target: tx.to, callData: tx.data })),
            ],
        }),
    };
};
const decode = async (client, data, transactions) => {
    if (typeof data === 'object') {
        throw getContractError(data, {
            abi: multicallTryAggregateSnippet,
            functionName: 'tryAggregate',
            args: [],
        });
    }
    const result = decodeFunctionResult({
        abi: multicallTryAggregateSnippet,
        functionName: 'tryAggregate',
        data,
    });
    const ccipChecked = await Promise.all(result.map(async ({ success, returnData }, i) => {
        let newObj = {
            success,
            returnData,
        };
        // OffchainLookup(address,string[],bytes,bytes4,bytes)
        if (!success && returnData.startsWith('0x556f1830')) {
            try {
                const newData = await offchainLookup(client, {
                    to: transactions[i].to,
                    data: returnData,
                });
                if (newData) {
                    newObj = { success: true, returnData: newData };
                }
            }
            catch { }
        }
        return newObj;
    }));
    return ccipChecked;
};
const multicallWrapper = generateFunction({ encode, decode });
export default multicallWrapper;
//# sourceMappingURL=multicallWrapper.js.map