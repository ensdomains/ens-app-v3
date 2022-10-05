// src/utils/recordHelpers.ts
import { formatsByCoinType, formatsByName } from "@ensdomains/address-encoder";
import { encodeContenthash } from "./contentHash.mjs";
var generateSetAddr = (namehash, coinType, address, resolver) => {
  let coinTypeInstance;
  if (!Number.isNaN(parseInt(coinType))) {
    coinTypeInstance = formatsByCoinType[parseInt(coinType)];
  } else {
    coinTypeInstance = formatsByName[coinType.toUpperCase()];
  }
  const inputCoinType = coinTypeInstance.coinType;
  const encodedAddress = coinTypeInstance.decoder(address);
  return resolver?.interface.encodeFunctionData(
    "setAddr(bytes32,uint256,bytes)",
    [namehash, inputCoinType, encodedAddress]
  );
};
function generateSingleRecordCall(namehash, resolver, type) {
  if (type === "contentHash") {
    return (_r) => {
      const record = _r;
      let _contentHash = "";
      if (record !== _contentHash) {
        const encoded = encodeContenthash(record);
        if (encoded.error)
          throw new Error(encoded.error);
        _contentHash = encoded.encoded;
      }
      return resolver.interface.encodeFunctionData("setContenthash", [
        namehash,
        _contentHash
      ]);
    };
  }
  return (_r) => {
    const record = _r;
    if (type === "text") {
      return resolver.interface.encodeFunctionData("setText", [
        namehash,
        record.key,
        record.value
      ]);
    }
    return generateSetAddr(namehash, record.key, record.value, resolver);
  };
}
var generateRecordCallArray = (namehash, records, resolver) => {
  const calls = [];
  if (records.clearRecords) {
    calls.push(
      resolver.interface.encodeFunctionData("clearRecords", [namehash])
    );
  }
  if (records.contentHash) {
    const data = generateSingleRecordCall(
      namehash,
      resolver,
      "contentHash"
    )(records.contentHash);
    if (data)
      calls.push(data);
  }
  if (records.texts && records.texts.length > 0) {
    records.texts.map(generateSingleRecordCall(namehash, resolver, "text")).forEach((call) => calls.push(call));
  }
  if (records.coinTypes && records.coinTypes.length > 0) {
    records.coinTypes.map(generateSingleRecordCall(namehash, resolver, "addr")).forEach((call) => calls.push(call));
  }
  return calls;
};
export {
  generateRecordCallArray,
  generateSetAddr,
  generateSingleRecordCall
};
