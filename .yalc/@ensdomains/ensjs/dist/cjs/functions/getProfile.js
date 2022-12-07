"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var getProfile_exports = {};
__export(getProfile_exports, {
  default: () => getProfile_default
});
module.exports = __toCommonJS(getProfile_exports);
var import_address_encoder = require("@ensdomains/address-encoder");
var import_ethers = require("ethers");
var import_utils = require("ethers/lib/utils");
var import_contentHash = require("../utils/contentHash");
var import_hexEncodedName = require("../utils/hexEncodedName");
var import_normalise = require("../utils/normalise");
var import_validation = require("../utils/validation");
const makeMulticallData = async ({
  _getAddr,
  _getContentHash,
  _getText
}, name, options) => {
  let calls = [];
  if (options.texts)
    calls = [
      ...calls,
      ...await Promise.all(
        options.texts.map(async (x) => ({
          key: x,
          data: await _getText.raw(name, x),
          type: "text"
        }))
      )
    ];
  if (options.coinTypes)
    calls = [
      ...calls,
      ...await Promise.all(
        options.coinTypes.map(async (x) => ({
          key: x,
          data: await _getAddr.raw(name, x, true),
          type: "addr"
        }))
      )
    ];
  if (typeof options.contentHash === "boolean" && options.contentHash) {
    calls.push({
      key: "contentHash",
      data: await _getContentHash.raw(name),
      type: "contentHash"
    });
  }
  if (!calls.find((x) => x.key === "60")) {
    calls.push({
      key: "60",
      data: await _getAddr.raw(name, "60", true),
      type: "addr"
    });
  }
  return { data: calls.map((x) => x.data.data), calls };
};
const fetchWithoutResolverMulticall = async ({ multicallWrapper }, calls, resolverAddress) => {
  const callsWithResolver = calls.map((call) => ({
    to: resolverAddress,
    data: call.data.data
  }));
  const results = await multicallWrapper(callsWithResolver);
  if (!results || !results.length)
    return [];
  return results.map((x) => x[1]);
};
const formatRecords = async ({
  _getText,
  _getAddr,
  _getContentHash
}, data, calls, options) => {
  const returnedRecords = (await Promise.all(
    data.map(async (item, i) => {
      let decodedFromAbi;
      let itemRet = {
        key: calls[i].key,
        type: calls[i].type
      };
      if (itemRet.type === "contentHash") {
        ;
        [decodedFromAbi] = import_ethers.ethers.utils.defaultAbiCoder.decode(
          ["bytes"],
          item
        );
        if (import_ethers.ethers.utils.hexStripZeros(decodedFromAbi) === "0x") {
          return;
        }
      }
      switch (calls[i].type) {
        case "text":
          itemRet = {
            ...itemRet,
            value: await _getText.decode(item)
          };
          if (itemRet.value === "" || itemRet.value === void 0)
            return;
          break;
        case "addr":
          try {
            const addr = await _getAddr.decode(item, "", calls[i].key);
            if (addr) {
              itemRet = {
                ...itemRet,
                ...addr
              };
              break;
            } else {
              return;
            }
          } catch {
            return;
          }
        case "contentHash":
          try {
            itemRet = {
              ...itemRet,
              value: await _getContentHash.decode(item)
            };
            break;
          } catch {
            return;
          }
      }
      return itemRet;
    })
  )).filter((x) => {
    return typeof x === "object";
  }).filter((x) => x);
  const returnedResponse = {};
  if (typeof options.contentHash === "string" || typeof options.contentHash === "object") {
    if (typeof options.contentHash === "string" && import_ethers.ethers.utils.hexStripZeros(options.contentHash) === "0x") {
      returnedResponse.contentHash = null;
    } else if (import_ethers.ethers.utils.isBytesLike(options.contentHash.decoded) && import_ethers.ethers.utils.hexStripZeros(options.contentHash.decoded) === "0x") {
      returnedResponse.contentHash = null;
    } else {
      returnedResponse.contentHash = options.contentHash;
    }
  } else if (options.contentHash) {
    const foundRecord = returnedRecords.find(
      (item) => item.type === "contentHash"
    );
    returnedResponse.contentHash = foundRecord ? foundRecord.value : null;
  }
  if (options.texts) {
    returnedResponse.texts = returnedRecords.filter(
      (x) => x.type === "text"
    );
  }
  if (options.coinTypes) {
    returnedResponse.coinTypes = returnedRecords.filter(
      (x) => x.type === "addr"
    );
  }
  return returnedResponse;
};
const getDataForName = async ({
  contracts,
  _getAddr,
  _getContentHash,
  _getText,
  multicallWrapper
}, name, options, specificResolver) => {
  const universalResolver = await contracts?.getUniversalResolver();
  const { data, calls } = await makeMulticallData(
    { _getAddr, _getContentHash, _getText },
    name,
    options
  );
  let recordData;
  let resolverAddress = specificResolver;
  if (specificResolver) {
    try {
      const publicResolver = await contracts?.getPublicResolver(
        void 0,
        specificResolver
      );
      recordData = await publicResolver?.callStatic.multicall(data);
    } catch (e) {
      console.error("getProfile error:", e);
      recordData = await fetchWithoutResolverMulticall(
        { multicallWrapper },
        calls,
        resolverAddress
      );
    }
  } else {
    const resolvedData = await universalResolver["resolve(bytes,bytes[])"](
      (0, import_hexEncodedName.hexEncodeName)(name),
      data,
      {
        ccipReadEnabled: true
      }
    );
    recordData = [...resolvedData["0"]];
    resolverAddress = resolvedData["1"];
    for (let i = 0; i < recordData.length; i += 1) {
      if (recordData[i].startsWith("0x0d1947a9")) {
        calls[i] = null;
        recordData[i] = null;
      }
    }
  }
  if (!resolverAddress || !recordData || (0, import_utils.hexStripZeros)(resolverAddress) === "0x") {
    return {
      address: null,
      records: {},
      resolverAddress: null
    };
  }
  const filteredCalls = calls.filter((x) => x);
  const filteredRecordData = recordData.filter((x) => x);
  const matchAddress = filteredRecordData[filteredCalls.findIndex((x) => x.key === "60")];
  return {
    address: matchAddress && await _getAddr.decode(matchAddress),
    records: await formatRecords(
      { _getAddr, _getContentHash, _getText },
      filteredRecordData,
      filteredCalls,
      options
    ),
    resolverAddress
  };
};
const graphFetch = async ({ gqlInstance }, name, wantedRecords, resolverAddress) => {
  const query = gqlInstance.gql`
    query getRecords($id: String!) {
      domain(id: $id) {
        isMigrated
        createdAt
        resolver {
          texts
          coinTypes
          contentHash
          addr {
            id
          }
        }
      }
    }
  `;
  const customResolverQuery = gqlInstance.gql`
    query getRecordsWithCustomResolver($id: String!, $resolverId: String!) {
      domain(id: $id) {
        isMigrated
        createdAt
      }
      resolver(id: $resolverId) {
        texts
        coinTypes
        contentHash
        addr {
          id
        }
      }
    }
  `;
  const { client } = gqlInstance;
  const id = (0, import_normalise.namehash)(name);
  let domain;
  let resolverResponse;
  if (!resolverAddress) {
    ;
    ({ domain } = await client.request(query, { id }));
    resolverResponse = domain?.resolver;
  } else {
    const resolverId = `${resolverAddress.toLowerCase()}-${id}`;
    ({ resolver: resolverResponse, domain } = await client.request(
      customResolverQuery,
      { id, resolverId }
    ));
  }
  if (!domain)
    return;
  const { isMigrated, createdAt } = domain;
  const returnedRecords = {};
  if (!resolverResponse || !wantedRecords)
    return { isMigrated, createdAt };
  Object.keys(wantedRecords).forEach((key) => {
    const data = wantedRecords[key];
    if (typeof data === "boolean" && data) {
      if (key === "contentHash") {
        returnedRecords[key] = (0, import_contentHash.decodeContenthash)(resolverResponse.contentHash);
      } else {
        returnedRecords[key] = resolverResponse[key];
      }
    }
  });
  return {
    ...returnedRecords,
    isMigrated,
    createdAt
  };
};
const getProfileFromName = async ({
  contracts,
  gqlInstance,
  _getAddr,
  _getContentHash,
  _getText,
  resolverMulticallWrapper,
  multicallWrapper
}, name, options) => {
  const { resolverAddress, fallback, ..._options } = options || {};
  const optsLength = Object.keys(_options).length;
  let usingOptions;
  if (!optsLength || _options?.texts === true || _options?.coinTypes === true) {
    if (optsLength)
      usingOptions = _options;
    else
      usingOptions = { contentHash: true, texts: true, coinTypes: true };
  }
  const graphResult = await graphFetch(
    { gqlInstance },
    name,
    usingOptions,
    resolverAddress
  );
  let isMigrated = null;
  let createdAt = null;
  let result = null;
  if (!graphResult) {
    if (!fallback)
      return;
    result = await getDataForName(
      {
        contracts,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
        multicallWrapper
      },
      name,
      fallback,
      void 0
    );
  } else {
    const {
      isMigrated: _isMigrated,
      createdAt: _createdAt,
      ...wantedRecords
    } = graphResult;
    isMigrated = _isMigrated;
    createdAt = _createdAt;
    let recordsWithFallback = usingOptions ? wantedRecords : _options;
    if ((Object.keys(recordsWithFallback).length === 0 || !recordsWithFallback.coinTypes && !recordsWithFallback.texts && Object.keys(recordsWithFallback.contentHash || {}).length === 0) && fallback) {
      recordsWithFallback = fallback;
    }
    result = await getDataForName(
      {
        contracts,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
        multicallWrapper
      },
      name,
      recordsWithFallback,
      options?.resolverAddress
    );
  }
  if (!result?.resolverAddress)
    return {
      isMigrated,
      createdAt,
      message: !result ? "Records fetch didn't complete" : "Name doesn't have a resolver"
    };
  return { ...result, isMigrated, createdAt, message: void 0 };
};
const getProfileFromAddress = async ({
  contracts,
  gqlInstance,
  getName,
  _getAddr,
  _getContentHash,
  _getText,
  resolverMulticallWrapper,
  multicallWrapper
}, address, options) => {
  let name;
  try {
    name = await getName(address);
  } catch (e) {
    return;
  }
  if (!name || !name.name || name.name === "")
    return;
  if (!name.match)
    return { ...name, isMigrated: null, createdAt: null };
  const result = await getProfileFromName(
    {
      contracts,
      gqlInstance,
      _getAddr,
      _getContentHash,
      _getText,
      resolverMulticallWrapper,
      multicallWrapper
    },
    name.name,
    options
  );
  if (!result || result.message)
    return;
  delete result.address;
  return {
    ...result,
    ...name,
    message: void 0
  };
};
const mapCoinTypes = (coin) => {
  if (!Number.isNaN(parseInt(coin))) {
    return coin;
  }
  return `${import_address_encoder.formatsByName[coin.toUpperCase()].coinType}`;
};
async function getProfile_default({
  contracts,
  gqlInstance,
  getName,
  _getAddr,
  _getContentHash,
  _getText,
  resolverMulticallWrapper,
  multicallWrapper
}, nameOrAddress, options) {
  if (options) {
    if (options.coinTypes && typeof options.coinTypes !== "boolean") {
      options.coinTypes = options.coinTypes.map(mapCoinTypes);
    }
    if (options.fallback && options.fallback.coinTypes) {
      options.fallback.coinTypes = options.fallback.coinTypes.map(mapCoinTypes);
    }
  }
  const inputType = (0, import_validation.parseInputType)(nameOrAddress);
  if (inputType.type === "unknown" || inputType.info === "unsupported") {
    throw new Error("Invalid input type");
  }
  if (inputType.type === "address") {
    return getProfileFromAddress(
      {
        contracts,
        gqlInstance,
        getName,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
        multicallWrapper
      },
      nameOrAddress,
      options
    );
  }
  return getProfileFromName(
    {
      contracts,
      gqlInstance,
      _getAddr,
      _getContentHash,
      _getText,
      resolverMulticallWrapper,
      multicallWrapper
    },
    nameOrAddress,
    options
  );
}
