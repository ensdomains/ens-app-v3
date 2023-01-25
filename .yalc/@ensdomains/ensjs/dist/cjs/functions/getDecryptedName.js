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
var getDecryptedName_exports = {};
__export(getDecryptedName_exports, {
  default: () => getDecryptedName_default
});
module.exports = __toCommonJS(getDecryptedName_exports);
var import_bytes = require("@ethersproject/bytes");
var import_hexEncodedName = require("../utils/hexEncodedName");
var import_labels = require("../utils/labels");
var import_normalise = require("../utils/normalise");
const raw = async ({ contracts }, name, allowIncomplete) => {
  const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData("names", [(0, import_normalise.namehash)(name)])
  };
};
const generateNameQuery = (labels) => {
  let query = "";
  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i];
    if ((0, import_labels.isEncodedLabelhash)(label)) {
      query += `
        label${i}: domains(where: { labelhash: "${(0, import_labels.decodeLabelhash)(
        label
      ).toLowerCase()}", labelName_not: null }) {
          labelName
        }
      `;
    }
  }
  return query;
};
const decode = async ({ contracts, gqlInstance }, data, name, allowIncomplete = false) => {
  var _a;
  if (data !== null) {
    const nameWrapper = await (contracts == null ? void 0 : contracts.getNameWrapper());
    try {
      const result = nameWrapper.interface.decodeFunctionResult("names", data);
      if ((0, import_bytes.hexStripZeros)(result["0"]) !== "0x") {
        const decoded = (0, import_hexEncodedName.hexDecodeName)(result["0"]);
        if (decoded && decoded !== ".")
          return decoded;
      }
    } catch (e) {
      console.error("Error decoding name: ", e);
      return;
    }
  }
  if ((0, import_labels.checkIsDecrypted)(name))
    return name;
  const labels = name.split(".");
  const decryptedNameQuery = gqlInstance.gql`
        query decodedName($id: String!) {
          namehashLookup: domains(where: { id: $id }) {
            name
          }
          ${generateNameQuery(labels)}
        }
      `;
  const decryptedNameResult = await gqlInstance.client.request(
    decryptedNameQuery,
    {
      id: (0, import_normalise.namehash)(name)
    }
  );
  if (!decryptedNameResult)
    return;
  const namehashLookupResult = (_a = decryptedNameResult == null ? void 0 : decryptedNameResult.namehashLookup[0]) == null ? void 0 : _a.name;
  let bestResult = namehashLookupResult;
  if (namehashLookupResult && (0, import_labels.checkIsDecrypted)(namehashLookupResult)) {
    return namehashLookupResult;
  }
  const { namehashLookup: _, ...labelNames } = decryptedNameResult;
  if (Object.keys(labelNames).length !== 0) {
    for (const [key, value] of Object.entries(
      labelNames
    )) {
      if (value.length && value[0].labelName) {
        labels[parseInt(key.replace("label", ""))] = value[0].labelName;
      }
    }
    const labelLookupResult = labels.join(".");
    if (!namehashLookupResult || (0, import_labels.getEncryptedLabelAmount)(namehashLookupResult) > (0, import_labels.getEncryptedLabelAmount)(labelLookupResult))
      bestResult = labelLookupResult;
  }
  if (!bestResult || !allowIncomplete && !(0, import_labels.checkIsDecrypted)(bestResult))
    return;
  return bestResult;
};
var getDecryptedName_default = {
  raw,
  decode
};
