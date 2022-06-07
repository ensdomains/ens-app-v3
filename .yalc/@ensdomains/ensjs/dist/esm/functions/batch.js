const raw = async ({ multicallWrapper }, ...items) => {
    const rawDataArr = await Promise.all(items.map(({ args, raw }, i) => {
        if (!raw) {
            throw new Error(`Function ${i} is not batchable`);
        }
        return raw(...args);
    }));
    return multicallWrapper.raw(rawDataArr);
};
const decode = async ({ multicallWrapper }, data, ...items) => {
    const response = await multicallWrapper.decode(data);
    if (!response)
        return null;
    return Promise.all(response.map((ret, i) => items[i].decode(ret.returnData, ...items[i].args)));
};
export default {
    raw,
    decode,
};
