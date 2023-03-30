// src/functions/batch.ts
var raw = async ({ multicallWrapper }, ...items) => {
  const rawDataArr = await Promise.all(
    items.map(({ args, raw: rawRef }, i) => {
      if (!rawRef) {
        throw new Error(`Function ${i} is not batchable`);
      }
      return rawRef(...args);
    })
  );
  const response = await multicallWrapper.raw(rawDataArr);
  return { ...response, passthrough: rawDataArr };
};
var decode = async ({ multicallWrapper }, data, passthrough, ...items) => {
  const response = await multicallWrapper.decode(data, passthrough);
  if (!response)
    return;
  return Promise.all(
    response.map((ret, i) => {
      if (passthrough[i].passthrough) {
        return items[i].decode(
          ret.returnData,
          passthrough[i].passthrough,
          ...items[i].args
        );
      }
      return items[i].decode(ret.returnData, ...items[i].args);
    })
  );
};
var batch_default = {
  raw,
  decode
};
export {
  batch_default as default
};
