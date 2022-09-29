// src/utils/singleCall.ts
var singleCall_default = async (provider, ensData, func, ...data) => func.raw(ensData, ...data).then((rawData) => provider.call(rawData)).catch(() => null).then((ret) => func.decode(ensData, ret, ...data));
export {
  singleCall_default as default
};
