// src/functions/batch.ts
import { ENSJSError } from "../utils/errors.mjs";
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
  const results = await Promise.allSettled(
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
  const reducedResults = results.reduce(
    (acc, result) => {
      if (result.status === "fulfilled") {
        return { ...acc, data: [...acc.data, result.value] };
      }
      const error = result.reason;
      if (error instanceof ENSJSError) {
        return {
          error: error.name,
          timestamp: error.timestamp,
          data: [...acc.data, error.data]
        };
      }
      return {
        error: acc.error || "ENSJSUnknownError",
        data: [...acc.data, void 0]
      };
    },
    { data: [] }
  );
  if (reducedResults.error)
    throw new ENSJSError({
      name: reducedResults.error,
      timestamp: reducedResults.timestamp,
      data: reducedResults.data
    });
  return reducedResults.data;
};
var batch_default = {
  raw,
  decode
};
export {
  batch_default as default
};
