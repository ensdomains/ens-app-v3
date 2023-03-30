// src/utils/singleCall.ts
var singleCall_default = async (provider, ensData, func, ...data) => {
  const { passthrough, ...rawData } = await func.raw(ensData, ...data);
  const result = await provider.call({ ...rawData, ccipReadEnabled: true }).catch(() => null);
  if (!result)
    return;
  if (passthrough)
    return func.decode(ensData, result, passthrough, ...data);
  return func.decode(ensData, result, ...data);
};
export {
  singleCall_default as default
};
