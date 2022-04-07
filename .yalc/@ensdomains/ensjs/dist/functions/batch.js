export async function _batch({ contracts }, transactions, requireSuccess = false) {
    const multicall = await contracts?.getMulticall();
    return multicall.callStatic.tryAggregate(requireSuccess, transactions.map((tx) => ({
        target: tx.to,
        callData: tx.data,
    })));
}
export async function batch({ contracts }, ...items) {
    const rawDataArr = await Promise.all(items.map(([func, ...args]) => {
        if (!func.raw) {
            throw new Error(`${func.name} is not batchable`);
        }
        return func.raw(...args);
    }));
    const response = await _batch({ contracts }, rawDataArr);
    return Promise.all(response.map((ret, i) => items[i][0].decode(ret.returnData, ...items[i].slice(1))));
}
