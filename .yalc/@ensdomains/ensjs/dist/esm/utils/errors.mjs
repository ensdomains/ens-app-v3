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
var returnOrThrow = async (data, meta, provider) => {
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
