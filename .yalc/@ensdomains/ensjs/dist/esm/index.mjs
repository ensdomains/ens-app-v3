// src/index.ts
import { getContractAddress as _getContractAddress } from "./contracts/getContractAddress.mjs";
import ContractManager from "./contracts/index.mjs";
import GqlManager from "./GqlManager.mjs";
import singleCall from "./utils/singleCall.mjs";
import writeTx from "./utils/writeTx.mjs";
var graphURIEndpoints = {
  1: "https://api.thegraph.com/subgraphs/name/ensdomains/ens",
  5: "https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli",
  11155111: "https://api.studio.thegraph.com/query/49574/enssepolia/version/latest"
};
var ENS = class {
  options;
  provider;
  graphURI;
  initialProvider;
  contracts;
  getContractAddress = _getContractAddress;
  gqlInstance = new GqlManager();
  constructor(options) {
    this.options = options;
    this.getContractAddress = options?.getContractAddress || _getContractAddress;
  }
  checkInitialProvider = async () => {
    if (!this.initialProvider) {
      return;
    }
    await this.setProvider(this.initialProvider);
  };
  forwardDependenciesFromArray = (dependencies) => Object.fromEntries(
    dependencies.map((dep) => [dep, this[dep]])
  );
  getModule = async (path, exportName) => {
    let mod = await import(
      /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
      `./functions/${path}`
    );
    if (mod.default?.[exportName]) {
      mod = mod.default;
    }
    return mod;
  };
  getFunction = (subFunc, writeable, exportName, mod, _path) => subFunc && !writeable ? mod[exportName][subFunc] : mod[exportName];
  importGenerator = (path, dependencies, exportName = "default", subFunc, passthrough) => {
    if (subFunc === "batch") {
      return (...args) => ({ args, ...passthrough });
    }
    const thisRef = this;
    const mainFunc = async function(...args) {
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
          const signer = options.signer || thisRef.provider?.getSigner(options.addressOrIndex);
          const populate = subFunc === "populateTransaction";
          if (!signer) {
            throw new Error("No signer specified");
          }
          delete options.addressOrIndex;
          delete options.signer;
          dependenciesToForward2 = { ...dependenciesToForward2, signer };
          return func(dependenciesToForward2, args[0], options).then(
            writeTx(signer, populate)
          );
        }
        return func(dependenciesToForward2, ...args);
      }
      const dependenciesToForward = thisRef.forwardDependenciesFromArray(dependencies);
      return singleCall(
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
  generateFunction = (path, dependencies, exportName = "default") => this.importGenerator(path, dependencies, exportName);
  generateWriteFunction = (path, dependencies, exportName = "default") => this.importGenerator(
    path,
    dependencies,
    exportName,
    "write"
  );
  generateRawFunction = (path, dependencies, exportName = "default") => this.importGenerator(
    path,
    dependencies,
    exportName,
    "combine"
  );
  setProvider = async (provider) => {
    this.provider = provider;
    const network = this.staticNetwork ? this.provider._network.chainId : (await this.provider.getNetwork()).chainId;
    if (this.options && this.options.graphURI) {
      this.graphURI = this.options.graphURI;
    } else {
      this.graphURI = graphURIEndpoints[network];
    }
    await this.gqlInstance.setUrl(this.graphURI);
    this.contracts = new ContractManager(
      this.provider,
      this.getContractAddress(String(network))
    );
  };
  withProvider = (provider) => {
    const newENS = new ENS(this.options);
    newENS.initialProvider = provider;
    return newENS;
  };
  batch = this.generateRawFunction(
    "initialGetters",
    ["multicallWrapper"],
    "batch"
  );
  getProfile = this.generateFunction(
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
  getName = this.generateRawFunction(
    "initialGetters",
    ["contracts"],
    "getName"
  );
  getResolver = this.generateRawFunction(
    "getResolver",
    ["contracts"]
  );
  getWrapperData = this.generateRawFunction("getWrapperData", ["contracts"]);
  getHistory = this.generateFunction(
    "getHistory",
    ["gqlInstance"],
    "getHistory"
  );
  getContentHash = this.generateRawFunction("initialGetters", ["contracts", "universalWrapper"], "getContentHash");
  _getContentHash = this.generateRawFunction("initialGetters", ["contracts"], "_getContentHash");
  getAddr = this.generateRawFunction(
    "initialGetters",
    ["contracts", "universalWrapper"],
    "getAddr"
  );
  _getAddr = this.generateRawFunction(
    "initialGetters",
    ["contracts"],
    "_getAddr"
  );
  getText = this.generateRawFunction(
    "initialGetters",
    ["contracts", "universalWrapper"],
    "getText"
  );
  _getText = this.generateRawFunction(
    "initialGetters",
    ["contracts"],
    "_getText"
  );
  getABI = this.generateRawFunction(
    "initialGetters",
    ["contracts", "universalWrapper"],
    "getABI"
  );
  _getABI = this.generateRawFunction(
    "initialGetters",
    ["contracts"],
    "_getABI"
  );
  getOwner = this.generateRawFunction(
    "initialGetters",
    ["contracts", "multicallWrapper", "gqlInstance"],
    "getOwner"
  );
  getExpiry = this.generateRawFunction(
    "initialGetters",
    ["contracts", "multicallWrapper"],
    "getExpiry"
  );
  getSubnames = this.generateFunction(
    "initialGetters",
    ["gqlInstance", "contracts"],
    "getSubnames"
  );
  getNames = this.generateFunction(
    "initialGetters",
    ["gqlInstance"],
    "getNames"
  );
  getPrice = this.generateRawFunction(
    "initialGetters",
    ["contracts", "multicallWrapper"],
    "getPrice"
  );
  getDNSOwner = this.generateFunction(
    "getDNSOwner",
    []
  );
  supportsTLD = this.generateFunction(
    "initialGetters",
    ["getOwner", "provider"],
    "supportsTLD"
  );
  getAvailable = this.generateRawFunction(
    "getAvailable",
    ["contracts"]
  );
  getDecryptedName = this.generateRawFunction("getDecryptedName", ["contracts", "gqlInstance"]);
  universalWrapper = this.generateRawFunction("initialGetters", ["contracts"], "universalWrapper");
  resolverMulticallWrapper = this.generateRawFunction("initialGetters", ["contracts"], "resolverMulticallWrapper");
  multicallWrapper = this.generateRawFunction("initialGetters", ["contracts", "provider"], "multicallWrapper");
  setName = this.generateWriteFunction(
    "setName",
    ["contracts"]
  );
  setRecords = this.generateWriteFunction(
    "setRecords",
    ["contracts", "provider", "getResolver"]
  );
  setRecord = this.generateWriteFunction(
    "setRecord",
    ["contracts", "provider", "getResolver"]
  );
  setResolver = this.generateWriteFunction(
    "setResolver",
    ["contracts"]
  );
  transferName = this.generateWriteFunction("transferName", ["contracts"]);
  transferController = this.generateWriteFunction("transferController", ["contracts"]);
  wrapName = this.generateWriteFunction(
    "wrapName",
    ["contracts"]
  );
  unwrapName = this.generateWriteFunction(
    "unwrapName",
    ["contracts"]
  );
  setFuses = this.generateWriteFunction(
    "setFuses",
    ["contracts"]
  );
  setChildFuses = this.generateWriteFunction("setFuses", ["contracts"], "setChildFuses");
  importDNSSECName = this.generateWriteFunction("importDNSSECName", ["contracts", "provider", "signer"]);
  createSubname = this.generateWriteFunction("createSubname", ["contracts", "getExpiry"]);
  deleteSubname = this.generateWriteFunction("deleteSubname", ["contracts"]);
  transferSubname = this.generateWriteFunction("transferSubname", ["contracts"]);
  commitName = this.generateWriteFunction(
    "commitName",
    ["contracts"]
  );
  registerName = this.generateWriteFunction("registerName", ["contracts"]);
  renewNames = this.generateWriteFunction(
    "renewNames",
    ["contracts"]
  );
  extendWrappedName = this.generateWriteFunction("renewNames", ["contracts"], "extendWrappedName");
};
export {
  ENS,
  graphURIEndpoints
};
