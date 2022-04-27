const raw = async ({ multicallWrapper }, ...items) => {
    const rawDataArr = await Promise.all(items.map(([func, ...args]) => {
        if (!func.raw) {
            throw new Error(`${func.name} is not batchable`);
        }
        return func.raw(...args);
    }));
    return multicallWrapper.raw(rawDataArr);
};
const decode = async ({ multicallWrapper }, data, ...items) => {
    const response = await multicallWrapper.decode(data);
    if (!response)
        return null;
    return Promise.all(response.map((ret, i) => items[i][0].decode(ret.returnData, ...items[i].slice(1))));
};
export default {
    raw,
    decode,
};
