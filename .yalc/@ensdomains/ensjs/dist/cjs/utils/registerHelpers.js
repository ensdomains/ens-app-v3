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
var registerHelpers_exports = {};
__export(registerHelpers_exports, {
  _makeCommitment: () => _makeCommitment,
  makeCommitment: () => makeCommitment,
  makeCommitmentData: () => makeCommitmentData,
  makeRegistrationData: () => makeRegistrationData,
  randomSecret: () => randomSecret
});
module.exports = __toCommonJS(registerHelpers_exports);
var import_abi = require("@ethersproject/abi");
var import_keccak256 = require("@ethersproject/keccak256");
var import_fuses = require("./fuses");
var import_labels = require("./labels");
var import_normalise = require("./normalise");
var import_recordHelpers = require("./recordHelpers");
const randomSecret = () => {
  const bytes = Buffer.allocUnsafe(32);
  return `0x${crypto.getRandomValues(bytes).toString("hex")}`;
};
const makeCommitmentData = ({
  name,
  owner,
  duration,
  resolver,
  records,
  reverseRecord,
  fuses,
  secret
}) => {
  var _a;
  const labelHash = (0, import_labels.labelhash)(name.split(".")[0]);
  const hash = (0, import_normalise.namehash)(name);
  const resolverAddress = resolver.address;
  const fuseData = (0, import_fuses.hasFuses)(fuses) ? (0, import_fuses.encodeFuses)(fuses, "child") : 0;
  if (reverseRecord) {
    if (!records) {
      records = { coinTypes: [{ key: "ETH", value: owner }] };
    } else if (!((_a = records.coinTypes) == null ? void 0 : _a.find((c) => c.key === "ETH"))) {
      if (!records.coinTypes)
        records.coinTypes = [];
      records.coinTypes.push({ key: "ETH", value: owner });
    }
  }
  const data = records ? (0, import_recordHelpers.generateRecordCallArray)(hash, records, resolver) : [];
  return [
    labelHash,
    owner,
    duration,
    secret,
    resolverAddress,
    data,
    !!reverseRecord,
    fuseData
  ];
};
const makeRegistrationData = (params) => {
  const commitmentData = makeCommitmentData(params);
  const label = params.name.split(".")[0];
  commitmentData[0] = label;
  return commitmentData;
};
const _makeCommitment = (params) => {
  return (0, import_keccak256.keccak256)(
    import_abi.defaultAbiCoder.encode(
      [
        "bytes32",
        "address",
        "uint256",
        "bytes32",
        "address",
        "bytes[]",
        "bool",
        "uint16"
      ],
      params
    )
  );
};
const makeCommitment = ({
  secret = randomSecret(),
  ...inputParams
}) => {
  const generatedParams = makeCommitmentData({
    ...inputParams,
    secret
  });
  const commitment = _makeCommitment(generatedParams);
  return {
    secret,
    commitment
  };
};
