'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.ENS = void 0
const contracts_1 = __importDefault(require('./contracts'))
const GqlManager_1 = __importDefault(require('./GqlManager'))
const singleCall_1 = __importDefault(require('./utils/singleCall'))
const graphURIEndpoints = {
  1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
  5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
}
class ENS {
  options
  provider
  graphURI
  initialProvider
  contracts
  gqlInstance = new GqlManager_1.default()
  constructor(options) {
    this.options = options
  }
  /**
   * Checks for an initial provider and if it exists, sets it as the provider
   * @returns {Promise<void>} - A promise that resolves when the provider is checked, and set if needed
   */
  checkInitialProvider = async () => {
    if (!this.initialProvider) {
      return
    }
    await this.setProvider(this.initialProvider)
    return
  }
  /**
   * Creates an object of ENS properties from an array
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @returns {Object} - An object of ENS properties
   */
  forwardDependenciesFromArray = (dependencies) =>
    // Creates an object from entries of the array
    Object.fromEntries(
      // Maps over dependencies and create arrays for each, e.g. ['contracts', contractObj]
      dependencies.map((dep) => [dep, this[dep]]),
    )
  /**
   * Creates a wrapper for a function to be dynamically imported, with the correct dependencies passed in
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @param {string} subFunc - The type of function being imported
   * @returns {Function} - The generated wrapped function
   */
  importGenerator = (
    path,
    dependencies,
    exportName = 'default',
    subFunc,
    passthrough,
  ) => {
    // if batch is specified, create batch func
    if (subFunc === 'batch') {
      return (...args) => ({ args, ...passthrough })
    }
    const thisRef = this
    const mainFunc = async function (...args) {
      // check the initial provider and set if it exists
      await thisRef.checkInitialProvider()
      // import the module dynamically
      const mod = await Promise.resolve().then(() =>
        __importStar(
          require(/* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
          `./functions/${path}`),
        ),
      )
      // if combine isn't specified, run normally
      // otherwise, create a function from the raw and decode functions
      if (subFunc !== 'combine') {
        // get the function to call
        const func = subFunc ? mod[exportName][subFunc] : mod[exportName]
        // get the dependencies to forward to the function as the first arg
        const dependenciesToForward =
          thisRef.forwardDependenciesFromArray(dependencies)
        // return the function with the dependencies forwarded
        return func(dependenciesToForward, ...args)
      } else {
        // get the dependencies to forward from raw and decode functions
        const dependenciesToForward =
          thisRef.forwardDependenciesFromArray(dependencies)
        // return singleCall function with dependencies forwarded
        return (0, singleCall_1.default)(
          thisRef.provider,
          dependenciesToForward,
          mod[exportName],
          ...args,
        )
      }
    }
    // if subfunc is combine, add raw and decode property methods to the function
    if (subFunc === 'combine') {
      mainFunc.raw = this.importGenerator(path, dependencies, exportName, 'raw')
      mainFunc.decode = this.importGenerator(
        path,
        dependencies,
        exportName,
        'decode',
      )
      mainFunc.batch = this.importGenerator(
        path,
        dependencies,
        exportName,
        'batch',
        { raw: mainFunc.raw, decode: mainFunc.decode },
      )
    }
    return mainFunc
  }
  /**
   * Generates a normal wrapped function
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @returns {OmitFirstArg} - The generated wrapped function
   */
  generateFunction = (path, dependencies, exportName = 'default') =>
    this.importGenerator(path, dependencies, exportName)
  /**
   * Generates a wrapped function from raw and decode exports
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @returns {GeneratedRawFunction} - The generated wrapped function
   */
  generateRawFunction = (path, dependencies, exportName = 'default') =>
    this.importGenerator(path, dependencies, exportName, 'combine')
  /**
   * Sets the provider for the ENS class
   * @param {ethers.providers.JsonRpcProvider} provider - The provider to set
   * @returns {Promise<void>} - A promise that resolves when the provider is set
   */
  setProvider = async (provider) => {
    this.provider = provider
    if (this.options && this.options.graphURI) {
      this.graphURI = this.options.graphURI
    } else {
      this.graphURI =
        graphURIEndpoints[(await this.provider.getNetwork()).chainId]
    }
    await this.gqlInstance.setUrl(this.graphURI)
    this.contracts = new contracts_1.default(this.provider)
    return
  }
  /**
   * Creates a new ENS instance with a different provider, ideally should be used individually with any given function
   * @param {ethers.providers.JsonRpcProvider} provider - The provider to use
   * @returns {ENS} - A new ENS instance with the given provider
   */
  withProvider = (provider) => {
    const newENS = new ENS(this.options)
    newENS.initialProvider = provider
    return newENS
  }
  batch = this.generateRawFunction('batch', ['multicallWrapper'])
  getProfile = this.generateFunction('getProfile', [
    'contracts',
    'gqlInstance',
    'getName',
    'resolverMulticallWrapper',
    '_getAddr',
    '_getContentHash',
    '_getText',
  ])
  getRecords = this.generateFunction('getRecords', ['getProfile'])
  getName = this.generateRawFunction('getName', ['contracts'])
  getResolver = this.generateRawFunction('getResolver', ['contracts'])
  getFuses = this.generateRawFunction('getFuses', ['contracts'])
  getHistory = this.generateFunction(
    'getHistory',
    ['gqlInstance'],
    'getHistory',
  )
  getHistoryWithDetail = this.generateFunction(
    'getHistory',
    ['contracts', 'gqlInstance', 'provider'],
    'getHistoryWithDetail',
  )
  getHistoryDetailForTransactionHash = this.generateFunction(
    'getHistory',
    ['contracts', 'provider'],
    'getHistoryDetailForTransactionHash',
  )
  getContentHash = this.generateRawFunction(
    'getSpecificRecord',
    ['contracts', 'universalWrapper'],
    'getContentHash',
  )
  _getContentHash = this.generateRawFunction(
    'getSpecificRecord',
    ['contracts'],
    '_getContentHash',
  )
  getAddr = this.generateRawFunction(
    'getSpecificRecord',
    ['contracts', 'universalWrapper'],
    'getAddr',
  )
  _getAddr = this.generateRawFunction(
    'getSpecificRecord',
    ['contracts'],
    '_getAddr',
  )
  getText = this.generateRawFunction(
    'getSpecificRecord',
    ['contracts', 'universalWrapper'],
    'getText',
  )
  _getText = this.generateRawFunction(
    'getSpecificRecord',
    ['contracts'],
    '_getText',
  )
  getOwner = this.generateRawFunction('getOwner', [
    'contracts',
    'multicallWrapper',
  ])
  getExpiry = this.generateRawFunction('getExpiry', [
    'contracts',
    'multicallWrapper',
  ])
  getSubnames = this.generateFunction('getSubnames', ['gqlInstance'])
  getNames = this.generateFunction('getNames', ['gqlInstance'])
  universalWrapper = this.generateRawFunction(
    'batchWrappers',
    ['contracts'],
    'universalWrapper',
  )
  resolverMulticallWrapper = this.generateRawFunction(
    'batchWrappers',
    ['contracts'],
    'resolverMulticallWrapper',
  )
  multicallWrapper = this.generateRawFunction(
    'batchWrappers',
    ['contracts'],
    'multicallWrapper',
  )
  setName = this.generateFunction('setName', ['contracts', 'provider'])
  setRecords = this.generateFunction('setRecords', [
    'contracts',
    'provider',
    'getResolver',
  ])
  setResolver = this.generateFunction('setResolver', ['contracts', 'provider'])
  transferName = this.generateFunction('transferName', [
    'contracts',
    'provider',
  ])
  wrapName = this.generateFunction('wrapName', ['contracts', 'provider'])
  unwrapName = this.generateFunction('unwrapName', ['contracts', 'provider'])
  burnFuses = this.generateFunction('burnFuses', ['contracts', 'provider'])
  createSubname = this.generateFunction('createSubname', [
    'contracts',
    'provider',
  ])
  deleteSubname = this.generateFunction('deleteSubname', [
    'contracts',
    'provider',
    'transferSubname',
  ])
  transferSubname = this.generateFunction('transferSubname', [
    'contracts',
    'provider',
  ])
}
exports.ENS = ENS
