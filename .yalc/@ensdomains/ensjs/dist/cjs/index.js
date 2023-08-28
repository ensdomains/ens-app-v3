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
var src_exports = {};
__export(src_exports, {
  ENS: () => ENS,
  graphURIEndpoints: () => graphURIEndpoints
});
module.exports = __toCommonJS(src_exports);
var import_getContractAddress = require("./contracts/getContractAddress");
var import_contracts2 = __toESM(require("./contracts/index"));
var import_GqlManager = __toESM(require("./GqlManager"));
var import_singleCall = __toESM(require("./utils/singleCall"));
var import_writeTx = __toESM(require("./utils/writeTx"));
const graphURIEndpoints = {
  1: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
  5: "https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli",
  11155111: "https://api.studio.thegraph.com/query/49574/enssepolia/version/latest"
};
class ENS {
  constructor(options) {
    this.getContractAddress = import_getContractAddress.getContractAddress;
    this.gqlInstance = new import_GqlManager.default();
    this.checkInitialProvider = async () => {
      if (!this.initialProvider) {
        return;
      }
      await this.setProvider(this.initialProvider);
    };
    this.forwardDependenciesFromArray = (dependencies) => Object.fromEntries(
      dependencies.map((dep) => [dep, this[dep]])
    );
    this.getModule = async (path, exportName) => {
      var _a;
      let mod = await import(
        /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
        `./functions/${path}`
      );
      if ((_a = mod.default) == null ? void 0 : _a[exportName]) {
        mod = mod.default;
      }
      return mod;
    };
    this.getFunction = (subFunc, writeable, exportName, mod, _path) => subFunc && !writeable ? mod[exportName][subFunc] : mod[exportName];
    this.importGenerator = (path, dependencies, exportName = "default", subFunc, passthrough) => {
      if (subFunc === "batch") {
        return (...args) => ({ args, ...passthrough });
      }
      const thisRef = this;
      const mainFunc = async function(...args) {
        var _a;
        await thisRef.checkInitialProvider();
        const mod = await thisRef.getModule(path, exportName);
        if (subFunc !== "combine") {
          const writeable = subFunc === "write" || subFunc === "populateTransaction";
          const func = thisRef.getFunction(
            subFunc,
            writeable,
            exportName,
            mod,
            path
          );
          let dependenciesToForward2 = thisRef.forwardDependenciesFromArray(dependencies);
          if (writeable) {
            const options = args[1] || {};
            const signer = options.signer || ((_a = thisRef.provider) == null ? void 0 : _a.getSigner(options.addressOrIndex));
            const populate = subFunc === "populateTransaction";
            if (!signer) {
              throw new Error("No signer specified");
            }
            delete options.addressOrIndex;
            delete options.signer;
            dependenciesToForward2 = { ...dependenciesToForward2, signer };
            return func(dependenciesToForward2, args[0], options).then(
              (0, import_writeTx.default)(signer, populate)
            );
          }
          return func(dependenciesToForward2, ...args);
        }
        const dependenciesToForward = thisRef.forwardDependenciesFromArray(dependencies);
        return (0, import_singleCall.default)(
          thisRef.provider,
          dependenciesToForward,
          thisRef.getFunction(void 0, void 0, exportName, mod, path),
          ...args
        );
      };
      if (subFunc === "combine") {
        mainFunc.raw = this.importGenerator(
          path,
          dependencies,
          exportName,
          "raw"
        );
        mainFunc.decode = this.importGenerator(
          path,
          dependencies,
          exportName,
          "decode"
        );
        mainFunc.batch = this.importGenerator(
          path,
          dependencies,
          exportName,
          "batch",
          { raw: mainFunc.raw, decode: mainFunc.decode }
        );
      } else if (subFunc === "write") {
        mainFunc.populateTransaction = this.importGenerator(
          path,
          dependencies,
          exportName,
          "populateTransaction"
        );
      }
      return mainFunc;
    };
    this.generateFunction = (path, dependencies, exportName = "default") => this.importGenerator(path, dependencies, exportName);
    this.generateWriteFunction = (path, dependencies, exportName = "default") => this.importGenerator(
      path,
      dependencies,
      exportName,
      "write"
    );
    this.generateRawFunction = (path, dependencies, exportName = "default") => this.importGenerator(
      path,
      dependencies,
      exportName,
      "combine"
    );
    this.setProvider = async (provider) => {
      this.provider = provider;
      const network = this.staticNetwork ? this.provider._network.chainId : (await this.provider.getNetwork()).chainId;
      if (this.options && this.options.graphURI) {
        this.graphURI = this.options.graphURI;
      } else {
        this.graphURI = graphURIEndpoints[network];
      }
      await this.gqlInstance.setUrl(this.graphURI);
      this.contracts = new import_contracts2.default(
        this.provider,
        this.getContractAddress(String(network))
      );
    };
    this.withProvider = (provider) => {
      const newENS = new ENS(this.options);
      newENS.initialProvider = provider;
      return newENS;
    };
    this.batch = this.generateRawFunction(
      "initialGetters",
      ["multicallWrapper"],
      "batch"
    );
    this.getProfile = this.generateFunction(
      "initialGetters",
      [
        "contracts",
        "gqlInstance",
        "getName",
        "resolverMulticallWrapper",
        "multicallWrapper",
        "_getAddr",
        "_getContentHash",
        "_getText"
      ],
      "getProfile"
    );
    this.getName = this.generateRawFunction(
      "initialGetters",
      ["contracts"],
      "getName"
    );
    this.getResolver = this.generateRawFunction(
      "getResolver",
      ["contracts"]
    );
    this.getWrapperData = this.generateRawFunction("getWrapperData", ["contracts"]);
    this.getHistory = this.generateFunction(
      "getHistory",
      ["gqlInstance"],
      "getHistory"
    );
    this.getContentHash = this.generateRawFunction("initialGetters", ["contracts", "universalWrapper"], "getContentHash");
    this._getContentHash = this.generateRawFunction("initialGetters", ["contracts"], "_getContentHash");
    this.getAddr = this.generateRawFunction(
      "initialGetters",
      ["contracts", "universalWrapper"],
      "getAddr"
    );
    this._getAddr = this.generateRawFunction(
      "initialGetters",
      ["contracts"],
      "_getAddr"
    );
    this.getText = this.generateRawFunction(
      "initialGetters",
      ["contracts", "universalWrapper"],
      "getText"
    );
    this._getText = this.generateRawFunction(
      "initialGetters",
      ["contracts"],
      "_getText"
    );
    this.getABI = this.generateRawFunction(
      "initialGetters",
      ["contracts", "universalWrapper"],
      "getABI"
    );
    this._getABI = this.generateRawFunction(
      "initialGetters",
      ["contracts"],
      "_getABI"
    );
    this.getOwner = this.generateRawFunction(
      "initialGetters",
      ["contracts", "multicallWrapper", "gqlInstance"],
      "getOwner"
    );
    this.getExpiry = this.generateRawFunction(
      "initialGetters",
      ["contracts", "multicallWrapper"],
      "getExpiry"
    );
    this.getSubnames = this.generateFunction(
      "initialGetters",
      ["gqlInstance", "contracts"],
      "getSubnames"
    );
    this.getNames = this.generateFunction(
      "initialGetters",
      ["gqlInstance"],
      "getNames"
    );
    this.getPrice = this.generateRawFunction(
      "initialGetters",
      ["contracts", "multicallWrapper"],
      "getPrice"
    );
    this.getDNSOwner = this.generateFunction(
      "getDNSOwner",
      []
    );
    this.supportsTLD = this.generateFunction(
      "initialGetters",
      ["getOwner", "provider"],
      "supportsTLD"
    );
    this.getAvailable = this.generateRawFunction(
      "getAvailable",
      ["contracts"]
    );
    this.getDecryptedName = this.generateRawFunction("getDecryptedName", ["contracts", "gqlInstance"]);
    this.universalWrapper = this.generateRawFunction("initialGetters", ["contracts"], "universalWrapper");
    this.resolverMulticallWrapper = this.generateRawFunction("initialGetters", ["contracts"], "resolverMulticallWrapper");
    this.multicallWrapper = this.generateRawFunction("initialGetters", ["contracts", "provider"], "multicallWrapper");
    this.setName = this.generateWriteFunction(
      "setName",
      ["contracts"]
    );
    this.setRecords = this.generateWriteFunction(
      "setRecords",
      ["contracts", "provider", "getResolver"]
    );
    this.setRecord = this.generateWriteFunction(
      "setRecord",
      ["contracts", "provider", "getResolver"]
    );
    this.setResolver = this.generateWriteFunction(
      "setResolver",
      ["contracts"]
    );
    this.transferName = this.generateWriteFunction("transferName", ["contracts"]);
    this.transferController = this.generateWriteFunction("transferController", ["contracts"]);
    this.wrapName = this.generateWriteFunction(
      "wrapName",
      ["contracts"]
    );
    this.unwrapName = this.generateWriteFunction(
      "unwrapName",
      ["contracts"]
    );
    this.setFuses = this.generateWriteFunction(
      "setFuses",
      ["contracts"]
    );
    this.setChildFuses = this.generateWriteFunction("setFuses", ["contracts"], "setChildFuses");
    this.importDNSSECName = this.generateWriteFunction("importDNSSECName", ["contracts", "provider", "signer"]);
    this.createSubname = this.generateWriteFunction("createSubname", ["contracts", "getExpiry"]);
    this.deleteSubname = this.generateWriteFunction("deleteSubname", ["contracts"]);
    this.transferSubname = this.generateWriteFunction("transferSubname", ["contracts"]);
    this.commitName = this.generateWriteFunction(
      "commitName",
      ["contracts"]
    );
    this.registerName = this.generateWriteFunction("registerName", ["contracts"]);
    this.renewNames = this.generateWriteFunction(
      "renewNames",
      ["contracts"]
    );
    this.extendWrappedName = this.generateWriteFunction("renewNames", ["contracts"], "extendWrappedName");
    this.options = options;
    this.getContractAddress = (options == null ? void 0 : options.getContractAddress) || import_getContractAddress.getContractAddress;
  }
}
