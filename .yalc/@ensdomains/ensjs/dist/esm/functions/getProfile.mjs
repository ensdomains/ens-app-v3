// src/functions/getProfile.ts
import { formatsByName } from "@ensdomains/address-encoder";
import { defaultAbiCoder } from "@ethersproject/abi";
import { isAddress } from "@ethersproject/address";
import { hexStripZeros, isBytesLike } from "@ethersproject/bytes";
import { decodeContenthash } from "../utils/contentHash.mjs";
import { hexEncodeName } from "../utils/hexEncodedName.mjs";
import { namehash } from "../utils/normalise.mjs";
import {
  ENSJSError,
  debugSubgraphLatency,
  getClientErrors
} from "../utils/errors.mjs";
var makeMulticallData = async ({
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
var fetchWithoutResolverMulticall = async ({ multicallWrapper }, calls, resolverAddress) => {
  const callsWithResolver = calls.map((call) => ({
    to: resolverAddress,
    data: call.data.data
  }));
  const results = await multicallWrapper(callsWithResolver);
  if (!results || !results.length)
    return [];
  return results.map((x) => x[1]);
};
var formatRecords = async ({
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
        [decodedFromAbi] = defaultAbiCoder.decode(["bytes"], item);
        if (hexStripZeros(decodedFromAbi) === "0x") {
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
    if (typeof options.contentHash === "string" && hexStripZeros(options.contentHash) === "0x") {
      returnedResponse.contentHash = null;
    } else if (isBytesLike(options.contentHash.decoded) && hexStripZeros(options.contentHash.decoded) === "0x") {
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
var getDataForName = async ({
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
    try {
      const resolvedData = await universalResolver["resolve(bytes,bytes[])"](
        hexEncodeName(name),
        data,
        {
          ccipReadEnabled: true
        }
      );
      recordData = [...resolvedData["0"]];
      resolverAddress = resolvedData["1"];
      for (let i = 0; i < recordData.length; i += 1) {
        if (recordData[i].startsWith("0x0d1947a9") || recordData[i] === "0x") {
          calls[i] = null;
          recordData[i] = null;
        }
      }
    } catch {
      const registryContract = await contracts?.getRegistry();
      resolverAddress = await registryContract?.resolver(namehash(name));
      return {
        address: void 0,
        records: {},
        resolverAddress,
        isInvalidResolverAddress: true
      };
    }
  }
  if (!resolverAddress || !recordData || hexStripZeros(resolverAddress) === "0x") {
    return {
      address: void 0,
      records: {},
      resolverAddress: void 0
    };
  }
  const filteredCalls = calls.filter((x) => x);
  const filteredRecordData = recordData.filter((x) => x);
  const matchAddress = filteredRecordData[filteredCalls.findIndex((x) => x.key === "60")];
  return {
    address: matchAddress && await _getAddr.decode(matchAddress).catch(() => false),
    records: await formatRecords(
      { _getAddr, _getContentHash, _getText },
      filteredRecordData,
      filteredCalls,
      options
    ),
    resolverAddress
  };
};
var graphFetch = async ({ gqlInstance }, name, wantedRecords, resolverAddress, skipGraph = true) => {
  if (skipGraph)
    return { status: void 0, result: void 0 };
  const query = gqlInstance.gql`
    query getRecords($id: String!) {
      domain(id: $id) {
        name
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
        name
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
  const id = namehash(name);
  let domain;
  let resolverResponse;
  let graphErrors;
  if (!resolverAddress) {
    const response = await client.request(query, { id }).catch((e) => {
      graphErrors = getClientErrors(e);
      return void 0;
    }).finally(debugSubgraphLatency);
    domain = response?.domain;
    resolverResponse = domain?.resolver;
  } else {
    const resolverId = `${resolverAddress.toLowerCase()}-${id}`;
    const response = await client.request(customResolverQuery, {
      id,
      resolverId
    }).catch((e) => {
      graphErrors = getClientErrors(e);
      return void 0;
    }).finally(debugSubgraphLatency);
    resolverResponse = response?.resolver;
    domain = response?.domain;
  }
  if (!domain)
    return { errors: graphErrors };
  const { isMigrated, createdAt, name: decryptedName } = domain;
  const returnedRecords = {};
  if (!resolverResponse || !wantedRecords)
    return {
      errors: graphErrors,
      result: { isMigrated, createdAt, decryptedName }
    };
  Object.keys(wantedRecords).forEach((key) => {
    const data = wantedRecords[key];
    if (typeof data === "boolean" && data) {
      if (key === "contentHash") {
        returnedRecords[key] = decodeContenthash(resolverResponse.contentHash);
      } else {
        returnedRecords[key] = resolverResponse[key];
      }
    }
  });
  return {
    errors: graphErrors,
    result: {
      ...returnedRecords,
      decryptedName,
      isMigrated,
      createdAt
    }
  };
};
var getProfileFromName = async ({
  contracts,
  gqlInstance,
  _getAddr,
  _getContentHash,
  _getText,
  resolverMulticallWrapper,
  multicallWrapper
}, name, options) => {
  const { resolverAddress, fallback, skipGraph, ..._options } = options || {};
  const optsLength = Object.keys(_options).length;
  let usingOptions;
  if (!optsLength || _options?.texts === true || _options?.coinTypes === true) {
    if (optsLength)
      usingOptions = _options;
    else
      usingOptions = { contentHash: true, texts: true, coinTypes: true };
  }
  const { errors, result: graphResult } = await graphFetch(
    { gqlInstance },
    name,
    usingOptions,
    resolverAddress,
    !!skipGraph
  );
  let isMigrated = null;
  let createdAt = null;
  let decryptedName = null;
  let result = null;
  if (!graphResult) {
    if (!fallback)
      return { errors };
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
      decryptedName: _decryptedName,
      ...wantedRecords
    } = graphResult;
    isMigrated = _isMigrated;
    createdAt = _createdAt;
    decryptedName = _decryptedName;
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
      errors,
      result: {
        isMigrated,
        createdAt,
        message: !result ? "Records fetch didn't complete" : "Name doesn't have a resolver"
      }
    };
  return {
    errors,
    result: {
      ...result,
      isMigrated,
      createdAt,
      decryptedName,
      message: void 0
    }
  };
};
var getProfileFromAddress = async ({
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
    return {};
  }
  if (!name || !name.name || name.name === "")
    return {};
  if (!name.match)
    return {
      result: { ...name, isMigrated: null, createdAt: null }
    };
  const { errors, result } = await getProfileFromName(
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
    return { errors };
  delete result.address;
  return {
    errors,
    result: {
      ...result,
      ...name,
      message: void 0
    }
  };
};
var mapCoinTypes = (coin) => {
  if (!Number.isNaN(parseInt(coin))) {
    return coin;
  }
  return `${formatsByName[coin.toUpperCase()].coinType}`;
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
  const inputIsAddress = isAddress(nameOrAddress);
  if (inputIsAddress) {
    const { errors: errors2, result: result2 } = await getProfileFromAddress(
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
    if (errors2)
      throw new ENSJSError({ data: result2, errors: errors2 });
    return result2;
  }
  const { errors, result } = await getProfileFromName(
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
  if (errors)
    throw new ENSJSError({ data: result, errors });
  return result;
}
export {
  getProfile_default as default
};
