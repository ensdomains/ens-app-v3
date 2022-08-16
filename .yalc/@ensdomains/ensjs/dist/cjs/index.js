"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENS = void 0;
const contracts_1 = __importDefault(require("./contracts"));
const getContractAddress_1 = require("./contracts/getContractAddress");
const GqlManager_1 = __importDefault(require("./GqlManager"));
const singleCall_1 = __importDefault(require("./utils/singleCall"));
const writeTx_1 = __importDefault(require("./utils/writeTx"));
const fuses_1 = __importDefault(require("./utils/fuses"));
const graphURIEndpoints = {
    1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
    4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
    5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
};
class ENS {
    options;
    provider;
    graphURI;
    initialProvider;
    contracts;
    getContractAddress = getContractAddress_1.getContractAddress;
    gqlInstance = new GqlManager_1.default();
    fuses = fuses_1.default;
    constructor(options) {
        this.options = options;
        this.getContractAddress = options?.getContractAddress || getContractAddress_1.getContractAddress;
    }
    /**
     * Checks for an initial provider and if it exists, sets it as the provider
     * @returns {Promise<void>} - A promise that resolves when the provider is checked, and set if needed
     */
    checkInitialProvider = async () => {
        if (!this.initialProvider) {
            return;
        }
        await this.setProvider(this.initialProvider);
        return;
    };
    /**
     * Creates an object of ENS properties from an array
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @returns {Object} - An object of ENS properties
     */
    forwardDependenciesFromArray = (dependencies) => 
    // Creates an object from entries of the array
    Object.fromEntries(
    // Maps over dependencies and create arrays for each, e.g. ['contracts', contractObj]
    dependencies.map((dep) => [dep, this[dep]]));
    /**
     * Creates a wrapper for a function to be dynamically imported, with the correct dependencies passed in
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @param {string} subFunc - The type of function being imported
     * @returns {Function} - The generated wrapped function
     */
    importGenerator = (path, dependencies, exportName = 'default', subFunc, passthrough) => {
        // if batch is specified, create batch func
        if (subFunc === 'batch') {
            return (...args) => ({ args, ...passthrough });
        }
        const thisRef = this;
        const mainFunc = async function (...args) {
            // check the initial provider and set if it exists
            await thisRef.checkInitialProvider();
            // import the module dynamically
            const mod = await Promise.resolve().then(() => __importStar(require(
            /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
            `./functions/${path}`)));
            // if combine isn't specified, run normally
            // otherwise, create a function from the raw and decode functions
            if (subFunc !== 'combine') {
                const writeable = subFunc === 'write' || subFunc === 'populateTransaction';
                // get the function to call
                const func = subFunc && !writeable ? mod[exportName][subFunc] : mod[exportName];
                // get the dependencies to forward to the function as the first arg
                let dependenciesToForward = thisRef.forwardDependenciesFromArray(dependencies);
                // if func is write func, inject signer into dependencies
                if (writeable) {
                    const options = (args[1] || {});
                    const signer = options.signer ||
                        thisRef.provider?.getSigner(options.addressOrIndex);
                    const populate = subFunc === 'populateTransaction';
                    if (!signer) {
                        throw new Error('No signer specified');
                    }
                    delete options.addressOrIndex;
                    delete options.signer;
                    dependenciesToForward = { ...dependenciesToForward, signer };
                    return func(dependenciesToForward, args[0], options).then((0, writeTx_1.default)(signer, populate));
                }
                // return the function with the dependencies forwarded
                return func(dependenciesToForward, ...args);
            }
            else {
                // get the dependencies to forward from raw and decode functions
                const dependenciesToForward = thisRef.forwardDependenciesFromArray(dependencies);
                // return singleCall function with dependencies forwarded
                return (0, singleCall_1.default)(thisRef.provider, dependenciesToForward, mod[exportName], ...args);
            }
        };
        // if subfunc is combine, add raw and decode property methods to the function
        if (subFunc === 'combine') {
            mainFunc.raw = this.importGenerator(path, dependencies, exportName, 'raw');
            mainFunc.decode = this.importGenerator(path, dependencies, exportName, 'decode');
            mainFunc.batch = this.importGenerator(path, dependencies, exportName, 'batch', { raw: mainFunc.raw, decode: mainFunc.decode });
        }
        else if (subFunc === 'write') {
            mainFunc.populateTransaction = this.importGenerator(path, dependencies, exportName, 'populateTransaction');
        }
        return mainFunc;
    };
    /**
     * Generates a normal wrapped function
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @returns {OmitFirstArg} - The generated wrapped function
     */
    generateFunction = (path, dependencies, exportName = 'default') => this.importGenerator(path, dependencies, exportName);
    /**
     * Generates a write wrapped function
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @returns {OmitFirstArg} - The generated wrapped function
     */
    generateWriteFunction = (path, dependencies, exportName = 'default') => this.importGenerator(path, dependencies, exportName, 'write');
    /**
     * Generates a wrapped function from raw and decode exports
     * @param {string} path - The path of the exported function
     * @param {FunctionDeps} dependencies - An array of ENS properties
     * @param {string} exportName - The export name of the target function
     * @returns {GeneratedRawFunction} - The generated wrapped function
     */
    generateRawFunction = (path, dependencies, exportName = 'default') => this.importGenerator(path, dependencies, exportName, 'combine');
    /**
     * Sets the provider for the ENS class
     * @param {ethers.providers.JsonRpcProvider} provider - The provider to set
     * @returns {Promise<void>} - A promise that resolves when the provider is set
     */
    setProvider = async (provider) => {
        this.provider = provider;
        const network = (await this.provider.getNetwork()).chainId;
        if (this.options && this.options.graphURI) {
            this.graphURI = this.options.graphURI;
        }
        else {
            this.graphURI = graphURIEndpoints[network];
        }
        await this.gqlInstance.setUrl(this.graphURI);
        this.contracts = new contracts_1.default(this.provider, this.getContractAddress(String(network)));
        return;
    };
    /**
     * Creates a new ENS instance with a different provider, ideally should be used individually with any given function
     * @param {ethers.providers.JsonRpcProvider} provider - The provider to use
     * @returns {ENS} - A new ENS instance with the given provider
     */
    withProvider = (provider) => {
        const newENS = new ENS(this.options);
        newENS.initialProvider = provider;
        return newENS;
    };
    batch = this.generateRawFunction('initialGetters', ['multicallWrapper'], 'batch');
    getProfile = this.generateFunction('initialGetters', [
        'contracts',
        'gqlInstance',
        'getName',
        'resolverMulticallWrapper',
        'multicallWrapper',
        '_getAddr',
        '_getContentHash',
        '_getText',
    ], 'getProfile');
    getRecords = this.generateFunction('initialGetters', ['getProfile'], 'getRecords');
    getName = this.generateRawFunction('initialGetters', ['contracts'], 'getName');
    getResolver = this.generateRawFunction('getResolver', ['contracts']);
    getFuses = this.generateRawFunction('getFuses', [
        'contracts',
    ]);
    getHistory = this.generateFunction('getHistory', ['gqlInstance'], 'getHistory');
    getHistoryWithDetail = this.generateFunction('getHistory', ['contracts', 'gqlInstance', 'provider'], 'getHistoryWithDetail');
    getHistoryDetailForTransactionHash = this.generateFunction('getHistory', ['contracts', 'provider'], 'getHistoryDetailForTransactionHash');
    getContentHash = this.generateRawFunction('initialGetters', ['contracts', 'universalWrapper'], 'getContentHash');
    _getContentHash = this.generateRawFunction('initialGetters', ['contracts'], '_getContentHash');
    getAddr = this.generateRawFunction('initialGetters', ['contracts', 'universalWrapper'], 'getAddr');
    _getAddr = this.generateRawFunction('initialGetters', ['contracts'], '_getAddr');
    getText = this.generateRawFunction('initialGetters', ['contracts', 'universalWrapper'], 'getText');
    _getText = this.generateRawFunction('initialGetters', ['contracts'], '_getText');
    getOwner = this.generateRawFunction('initialGetters', ['contracts', 'multicallWrapper'], 'getOwner');
    getExpiry = this.generateRawFunction('initialGetters', ['contracts', 'multicallWrapper'], 'getExpiry');
    getSubnames = this.generateFunction('initialGetters', ['gqlInstance'], 'getSubnames');
    getNames = this.generateFunction('initialGetters', ['gqlInstance'], 'getNames');
    getPrice = this.generateRawFunction('initialGetters', ['contracts', 'multicallWrapper'], 'getPrice');
    universalWrapper = this.generateRawFunction('initialGetters', ['contracts'], 'universalWrapper');
    resolverMulticallWrapper = this.generateRawFunction('initialGetters', ['contracts'], 'resolverMulticallWrapper');
    multicallWrapper = this.generateRawFunction('initialGetters', ['contracts'], 'multicallWrapper');
    setFuses = this.generateWriteFunction('setFuses', [
        'contracts',
    ]);
    setName = this.generateWriteFunction('setName', [
        'contracts',
    ]);
    setRecords = this.generateWriteFunction('setRecords', ['contracts', 'provider', 'getResolver']);
    setRecord = this.generateWriteFunction('setRecord', [
        'contracts',
        'provider',
        'getResolver',
    ]);
    setResolver = this.generateWriteFunction('setResolver', ['contracts']);
    transferName = this.generateWriteFunction('transferName', ['contracts']);
    wrapName = this.generateWriteFunction('wrapName', [
        'contracts',
        'getExpiry',
    ]);
    unwrapName = this.generateWriteFunction('unwrapName', ['contracts']);
    burnFuses = this.generateWriteFunction('burnFuses', [
        'contracts',
    ]);
    createSubname = this.generateWriteFunction('createSubname', ['contracts', 'getExpiry']);
    deleteSubname = this.generateWriteFunction('deleteSubname', ['transferSubname']);
    transferSubname = this.generateWriteFunction('transferSubname', ['contracts', 'getExpiry']);
    getDNSOwner = this.generateFunction('getDNSOwner', []);
}
exports.ENS = ENS;
