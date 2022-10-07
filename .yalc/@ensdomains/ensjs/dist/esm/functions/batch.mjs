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
  return multicallWrapper.raw(rawDataArr);
};
var decode = async ({ multicallWrapper }, data, ...items) => {
  const response = await multicallWrapper.decode(data);
  if (!response)
    return;
  return Promise.all(
    response.map(
      (ret, i) => items[i].decode(ret.returnData, ...items[i].args)
    )
  );
};
var batch_default = {
  raw,
  decode
};
export {
  batch_default as default
};
