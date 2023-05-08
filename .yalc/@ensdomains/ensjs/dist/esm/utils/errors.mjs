// src/utils/errors.ts
var ENSJSError = class extends Error {
  name;
  data;
  timestamp;
  constructor({
    name,
    data,
    timestamp
  }) {
    super();
    this.name = name;
    this.data = data;
    this.timestamp = timestamp;
  }
};
var debugFlow = async (data, meta, provider) => {
  if (!meta)
    return;
  const testName = localStorage.getItem("ensjs-debug") || "";
  if (testName === "ENSJSSubgraphIndexingError") {
    const blockNumber = meta?.block?.number;
    const block = blockNumber ? await provider?.getBlock(blockNumber - 1) : void 0;
    const timestamp = block?.timestamp;
    throw new ENSJSError({
      name: "ENSJSSubgraphIndexingError",
      data,
      timestamp
    });
  }
  if (testName === "ENSJSUnknownError") {
    throw new ENSJSError({
      name: "ENSJSUnknownError"
    });
  }
  if (testName === "ENSJSNetworkLatencyError") {
    await new Promise((resolve) => {
      setTimeout(() => resolve(true), 1e4);
    });
  }
};
var returnOrThrow = async (data, meta, provider) => {
  if (true) {
    await debugFlow(data, meta, provider);
  }
  if (meta?.hasIndexingErrors && provider) {
    const blockNumber = meta.block?.number;
    const block = await provider?.getBlock(blockNumber);
    const timestamp = block?.timestamp;
    throw new ENSJSError({
      name: "ENSJSSubgraphIndexingError",
      timestamp,
      data
    });
  }
  return data;
};
export {
  ENSJSError,
  returnOrThrow
};
