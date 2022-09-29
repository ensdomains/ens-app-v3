"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
var import_ethers = require("ethers");
var import_generateFuseInput = __toESM(require("./generateFuseInput"));
var import_labels = require("./labels");
var import_normalise = require("./normalise");
var import_recordHelpers = require("./recordHelpers");
const MAX_INT_64 = 2n ** 64n - 1n;
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
  wrapperExpiry,
  secret
}) => {
  const label = (0, import_labels.labelhash)(name.split(".")[0]);
  const hash = (0, import_normalise.namehash)(name);
  const resolverAddress = resolver.address;
  const fuseData = fuses ? (0, import_generateFuseInput.default)(fuses) : "0";
  if (reverseRecord) {
    if (!records) {
      records = { coinTypes: [{ key: "ETH", value: owner }] };
    } else if (!records.coinTypes?.find((c) => c.key === "ETH")) {
      if (!records.coinTypes)
        records.coinTypes = [];
      records.coinTypes.push({ key: "ETH", value: owner });
    }
  }
  const data = records ? (0, import_recordHelpers.generateRecordCallArray)(hash, records, resolver) : [];
  return [
    label,
    owner,
    duration,
    resolverAddress,
    data,
    secret,
    !!reverseRecord,
    fuseData,
    wrapperExpiry || MAX_INT_64
  ];
};
const makeRegistrationData = (params) => {
  const commitmentData = makeCommitmentData(params);
  const label = params.name.split(".")[0];
  commitmentData[0] = label;
  const secret = commitmentData.splice(5, 1)[0];
  commitmentData.splice(3, 0, secret);
  return commitmentData;
};
const _makeCommitment = (params) => {
  return import_ethers.utils.keccak256(
    import_ethers.utils.defaultAbiCoder.encode(
      [
        "bytes32",
        "address",
        "uint256",
        "address",
        "bytes[]",
        "bytes32",
        "bool",
        "uint32",
        "uint64"
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
    commitment,
    wrapperExpiry: generatedParams[8]
  };
};
