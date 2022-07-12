import ContractManager from './contracts';
import { getContractAddress as _getContractAddress } from './contracts/getContractAddress';
import GqlManager from './GqlManager';
import singleCall from './utils/singleCall';
const graphURIEndpoints = {
    1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
    4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
    5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
};
export class ENS {
    constructor(options) {
        this.getContractAddress = _getContractAddress;
        this.gqlInstance = new GqlManager();
        /**
         * Checks for an initial provider and if it exists, sets it as the provider
         * @returns {Promise<void>} - A promise that resolves when the provider is checked, and set if needed
         */
        this.checkInitialProvider = async () => {
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
        this.forwardDependenciesFromArray = (dependencies) => 
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
        this.importGenerator = (path, dependencies, exportName = 'default', subFunc, passthrough) => {
            // if batch is specified, create batch func
            if (subFunc === 'batch') {
                return (...args) => ({ args, ...passthrough });
            }
            const thisRef = this;
            const mainFunc = async function (...args) {
                // check the initial provider and set if it exists
                await thisRef.checkInitialProvider();
                // import the module dynamically
                const mod = await import(
                /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
                `./functions/${path}`);
                // if combine isn't specified, run normally
                // otherwise, create a function from the raw and decode functions
                if (subFunc !== 'combine') {
                    // get the function to call
                    const func = subFunc && subFunc !== 'write'
                        ? mod[exportName][subFunc]
                        : mod[exportName];
                    // get the dependencies to forward to the function as the first arg
                    let dependenciesToForward = thisRef.forwardDependenciesFromArray(dependencies);
                    // if func is write func, inject signer into dependencies
                    if (subFunc === 'write') {
                        const options = (args[1] || {});
                        const signer = options.signer ||
                            thisRef.provider?.getSigner(options.addressOrIndex);
                        if (!signer) {
                            throw new Error('No signer specified');
                        }
                        delete options.addressOrIndex;
                        delete options.signer;
                        dependenciesToForward = { ...dependenciesToForward, signer };
                        return func(dependenciesToForward, args[0], options);
                    }
                    // return the function with the dependencies forwarded
                    return func(dependenciesToForward, ...args);
                }
                else {
                    // get the dependencies to forward from raw and decode functions
                    const dependenciesToForward = thisRef.forwardDependenciesFromArray(dependencies);
                    // return singleCall function with dependencies forwarded
                    return singleCall(thisRef.provider, dependenciesToForward, mod[exportName], ...args);
                }
            };
            // if subfunc is combine, add raw and decode property methods to the function
            if (subFunc === 'combine') {
                mainFunc.raw = this.importGenerator(path, dependencies, exportName, 'raw');
                mainFunc.decode = this.importGenerator(path, dependencies, exportName, 'decode');
                mainFunc.batch = this.importGenerator(path, dependencies, exportName, 'batch', { raw: mainFunc.raw, decode: mainFunc.decode });
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
        this.generateFunction = (path, dependencies, exportName = 'default') => this.importGenerator(path, dependencies, exportName);
        /**
         * Generates a write wrapped function
         * @param {string} path - The path of the exported function
         * @param {FunctionDeps} dependencies - An array of ENS properties
         * @param {string} exportName - The export name of the target function
         * @returns {OmitFirstArg} - The generated wrapped function
         */
        this.generateWriteFunction = (path, dependencies, exportName = 'default') => this.importGenerator(path, dependencies, exportName, 'write');
        /**
         * Generates a wrapped function from raw and decode exports
         * @param {string} path - The path of the exported function
         * @param {FunctionDeps} dependencies - An array of ENS properties
         * @param {string} exportName - The export name of the target function
         * @returns {GeneratedRawFunction} - The generated wrapped function
         */
        this.generateRawFunction = (path, dependencies, exportName = 'default') => this.importGenerator(path, dependencies, exportName, 'combine');
        /**
         * Sets the provider for the ENS class
         * @param {ethers.providers.JsonRpcProvider} provider - The provider to set
         * @returns {Promise<void>} - A promise that resolves when the provider is set
         */
        this.setProvider = async (provider) => {
            this.provider = provider;
            const network = (await this.provider.getNetwork()).chainId;
            if (this.options && this.options.graphURI) {
                this.graphURI = this.options.graphURI;
            }
            else {
                this.graphURI = graphURIEndpoints[network];
            }
            await this.gqlInstance.setUrl(this.graphURI);
            this.contracts = new ContractManager(this.provider, this.getContractAddress(String(network)));
            return;
        };
        /**
         * Creates a new ENS instance with a different provider, ideally should be used individually with any given function
         * @param {ethers.providers.JsonRpcProvider} provider - The provider to use
         * @returns {ENS} - A new ENS instance with the given provider
         */
        this.withProvider = (provider) => {
            const newENS = new ENS(this.options);
            newENS.initialProvider = provider;
            return newENS;
        };
        this.batch = this.generateRawFunction('initialGetters', ['multicallWrapper'], 'batch');
        this.getProfile = this.generateFunction('initialGetters', [
            'contracts',
            'gqlInstance',
            'getName',
            'resolverMulticallWrapper',
            'multicallWrapper',
            '_getAddr',
            '_getContentHash',
            '_getText',
        ], 'getProfile');
        this.getRecords = this.generateFunction('initialGetters', ['getProfile'], 'getRecords');
        this.getName = this.generateRawFunction('initialGetters', ['contracts'], 'getName');
        this.getResolver = this.generateRawFunction('getResolver', ['contracts']);
        this.getFuses = this.generateRawFunction('getFuses', [
            'contracts',
        ]);
        this.getHistory = this.generateFunction('getHistory', ['gqlInstance'], 'getHistory');
        this.getHistoryWithDetail = this.generateFunction('getHistory', ['contracts', 'gqlInstance', 'provider'], 'getHistoryWithDetail');
        this.getHistoryDetailForTransactionHash = this.generateFunction('getHistory', ['contracts', 'provider'], 'getHistoryDetailForTransactionHash');
        this.getContentHash = this.generateRawFunction('initialGetters', ['contracts', 'universalWrapper'], 'getContentHash');
        this._getContentHash = this.generateRawFunction('initialGetters', ['contracts'], '_getContentHash');
        this.getAddr = this.generateRawFunction('initialGetters', ['contracts', 'universalWrapper'], 'getAddr');
        this._getAddr = this.generateRawFunction('initialGetters', ['contracts'], '_getAddr');
        this.getText = this.generateRawFunction('initialGetters', ['contracts', 'universalWrapper'], 'getText');
        this._getText = this.generateRawFunction('initialGetters', ['contracts'], '_getText');
        this.getOwner = this.generateRawFunction('initialGetters', ['contracts', 'multicallWrapper'], 'getOwner');
        this.getExpiry = this.generateRawFunction('initialGetters', ['contracts', 'multicallWrapper'], 'getExpiry');
        this.getSubnames = this.generateFunction('initialGetters', ['gqlInstance'], 'getSubnames');
        this.getNames = this.generateFunction('initialGetters', ['gqlInstance'], 'getNames');
        this.getPrice = this.generateRawFunction('initialGetters', ['contracts', 'multicallWrapper'], 'getPrice');
        this.universalWrapper = this.generateRawFunction('initialGetters', ['contracts'], 'universalWrapper');
        this.resolverMulticallWrapper = this.generateRawFunction('initialGetters', ['contracts'], 'resolverMulticallWrapper');
        this.multicallWrapper = this.generateRawFunction('initialGetters', ['contracts'], 'multicallWrapper');
        this.setName = this.generateWriteFunction('setName', [
            'contracts',
        ]);
        this.setRecords = this.generateWriteFunction('setRecords', ['contracts', 'provider', 'getResolver']);
        this.setResolver = this.generateWriteFunction('setResolver', ['contracts']);
        this.transferName = this.generateWriteFunction('transferName', ['contracts']);
        this.wrapName = this.generateWriteFunction('wrapName', [
            'contracts',
        ]);
        this.unwrapName = this.generateWriteFunction('unwrapName', ['contracts']);
        this.burnFuses = this.generateWriteFunction('burnFuses', [
            'contracts',
        ]);
        this.createSubname = this.generateWriteFunction('createSubname', ['contracts']);
        this.deleteSubname = this.generateWriteFunction('deleteSubname', ['transferSubname']);
        this.transferSubname = this.generateWriteFunction('transferSubname', ['contracts']);
        this.getDNSOwner = this.generateFunction('getDNSOwner', []);
        this.options = options;
        this.getContractAddress = options?.getContractAddress || _getContractAddress;
    }
}
