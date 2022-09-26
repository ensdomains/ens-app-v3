import type { JsonRpcSigner } from '@ethersproject/providers'
import { ContractTransaction, ethers, PopulatedTransaction } from 'ethers'
import { getContractAddress as _getContractAddress } from './contracts/getContractAddress'
import ContractManager from './contracts/index'
import { SupportedNetworkId } from './contracts/types'
import type batch from './functions/batch'
import type {
  multicallWrapper,
  resolverMulticallWrapper,
  universalWrapper,
} from './functions/batchWrappers'
import type burnFuses from './functions/burnFuses'
import type commitName from './functions/commitName'
import type createSubname from './functions/createSubname'
import type deleteSubname from './functions/deleteSubname'
import type getDNSOwner from './functions/getDNSOwner'
import type getExpiry from './functions/getExpiry'
import type getFuses from './functions/getFuses'
import type { getHistory } from './functions/getHistory'
import type getName from './functions/getName'
import type getNames from './functions/getNames'
import type getOwner from './functions/getOwner'
import type getPrice from './functions/getPrice'
import type getProfile from './functions/getProfile'
import type getRecords from './functions/getRecords'
import type getResolver from './functions/getResolver'
import type {
  getAddr,
  getContentHash,
  getText,
  _getAddr,
  _getContentHash,
  _getText,
} from './functions/getSpecificRecord'
import type getSubnames from './functions/getSubnames'
import type registerName from './functions/registerName'
import type renewNames from './functions/renewNames'
import type setName from './functions/setName'
import type setRecord from './functions/setRecord'
import type setRecords from './functions/setRecords'
import type setResolver from './functions/setResolver'
import type transferName from './functions/transferName'
import type transferSubname from './functions/transferSubname'
import type unwrapName from './functions/unwrapName'
import type wrapName from './functions/wrapName'
import GqlManager from './GqlManager'
import singleCall from './utils/singleCall'
import writeTx from './utils/writeTx'

export type {
  Fuse,
  FuseArrayPossibilities,
  FuseObj,
  NamedFusesToBurn,
  UnnamedFuseType,
  UnnamedFuseValues,
} from './utils/fuses'

type ENSOptions = {
  graphURI?: string | null
  getContractAddress?: typeof _getContractAddress
}

export type InternalENS = {
  options?: ENSOptions
  provider?: ethers.providers.Provider
  signer: JsonRpcSigner
  graphURI?: string | null
} & ENS

export type ENSArgs<K extends keyof InternalENS> = {
  [P in K]: InternalENS[P]
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never

type OmitFirstTwoArgs<F> = F extends (
  x: any,
  y: any,
  ...args: infer P
) => infer R
  ? (...args: P) => R
  : never

type FirstArg<F> = F extends (x: infer A, ...args: any[]) => any ? A : never

type FunctionDeps<F> = Extract<keyof FirstArg<F>, string>[]

type WriteOptions = {
  addressOrIndex?: string | number
  signer?: JsonRpcSigner
}

type OptionalWriteOptions<F> = F extends (
  x: any,
  arg_0: infer Z,
  options?: infer P,
) => infer R
  ? (name: Z, options?: P & WriteOptions) => R
  : F extends (x: any, arg_0: infer Z, options: infer P) => infer R
  ? (name: Z, options: P & WriteOptions) => R
  : never

interface WriteFunction<F extends (...args: any) => any> extends Function {
  (...args: Parameters<OptionalWriteOptions<F>>): Promise<
    ContractTransaction & {
      customData?: Record<string, any>
    }
  >
  populateTransaction: (
    ...args: Parameters<OptionalWriteOptions<F>>
  ) => Promise<PopulatedTransaction>
}

/* eslint-disable @typescript-eslint/naming-convention */
const graphURIEndpoints: Record<string, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
  5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
}
/* eslint-enable @typescript-eslint/naming-convention */

export type RawFunction = {
  raw: (...args: any[]) => Promise<{ to: string; data: string }>
  decode: (...args: any[]) => Promise<any>
}

export type BatchFunctionResult<F extends RawFunction> = {
  args: Parameters<OmitFirstArg<F['raw']>>
  raw: F['raw']
  decode: F['decode']
}

type BatchFunction<F extends RawFunction> = (
  ...args: Parameters<OmitFirstArg<F['raw']>>
) => BatchFunctionResult<F>

export type RawFunctionWithBatch = {
  batch: BatchFunction<any>
} & RawFunction

interface GeneratedRawFunction<F extends RawFunction>
  extends Function,
    RawFunction {
  (...args: Parameters<OmitFirstArg<F['raw']>>): ReturnType<
    OmitFirstTwoArgs<F['decode']>
  >
  batch: BatchFunction<F>
}

type CombineFunctionDeps<F> = F extends RawFunction
  ? FunctionDeps<F['raw']> | FunctionDeps<F['decode']>
  : never

export interface GenericGeneratedRawFunction
  extends Function,
    RawFunctionWithBatch {}

export class ENS {
  [x: string]: any

  protected options?: ENSOptions

  protected provider?: ethers.providers.JsonRpcProvider

  protected graphURI?: string | null

  protected initialProvider?: ethers.providers.JsonRpcProvider

  contracts?: ContractManager

  getContractAddress = _getContractAddress

  gqlInstance = new GqlManager()

  constructor(options?: ENSOptions) {
    this.options = options
    this.getContractAddress = options?.getContractAddress || _getContractAddress
  }

  /**
   * Checks for an initial provider and if it exists, sets it as the provider
   * @returns {Promise<void>} - A promise that resolves when the provider is checked, and set if needed
   */
  private checkInitialProvider = async (): Promise<void> => {
    if (!this.initialProvider) {
      return
    }
    await this.setProvider(this.initialProvider)
  }

  /**
   * Creates an object of ENS properties from an array
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @returns {Object} - An object of ENS properties
   */
  private forwardDependenciesFromArray = <F>(
    dependencies: FunctionDeps<F>,
  ): object =>
    // Creates an object from entries of the array
    Object.fromEntries(
      // Maps over dependencies and create arrays for each, e.g. ['contracts', contractObj]
      dependencies.map((dep) => [dep, this[dep as keyof InternalENS]]),
    )

  /**
   * Creates a wrapper for a function to be dynamically imported, with the correct dependencies passed in
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @param {string} subFunc - The type of function being imported
   * @returns {Function} - The generated wrapped function
   */
  private importGenerator = <F>(
    path: string,
    dependencies: FunctionDeps<F>,
    exportName: string = 'default',
    subFunc?:
      | 'raw'
      | 'decode'
      | 'combine'
      | 'batch'
      | 'write'
      | 'populateTransaction',
    passthrough?: RawFunction,
  ): Function => {
    // if batch is specified, create batch func
    if (subFunc === 'batch') {
      return (...args: any[]) => ({ args, ...passthrough })
    }

    const thisRef = this
    const mainFunc = async function (...args: any[]) {
      // check the initial provider and set if it exists
      await thisRef.checkInitialProvider()
      // import the module dynamically
      const mod = await import(
        /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
        `./functions/${path}`
      )

      // if combine isn't specified, run normally
      // otherwise, create a function from the raw and decode functions
      if (subFunc !== 'combine') {
        const writeable =
          subFunc === 'write' || subFunc === 'populateTransaction'
        // get the function to call
        const func =
          subFunc && !writeable ? mod[exportName][subFunc] : mod[exportName]
        // get the dependencies to forward to the function as the first arg
        let dependenciesToForward =
          thisRef.forwardDependenciesFromArray<F>(dependencies)

        // if func is write func, inject signer into dependencies
        if (writeable) {
          const options = (args[1] || {}) as WriteOptions
          const signer =
            options.signer ||
            thisRef.provider?.getSigner(options.addressOrIndex)
          const populate = subFunc === 'populateTransaction'
          if (!signer) {
            throw new Error('No signer specified')
          }
          delete options.addressOrIndex
          delete options.signer
          dependenciesToForward = { ...dependenciesToForward, signer }
          return func(dependenciesToForward, args[0], options).then(
            writeTx(signer, populate),
          )
        }

        // return the function with the dependencies forwarded
        return func(dependenciesToForward, ...args)
      }
      // get the dependencies to forward from raw and decode functions
      const dependenciesToForward = thisRef.forwardDependenciesFromArray<
        CombineFunctionDeps<F>
      >(dependencies as any)

      // return singleCall function with dependencies forwarded
      return singleCall(
        thisRef.provider!,
        dependenciesToForward,
        mod[exportName],
        ...args,
      )
    }

    // if subfunc is combine, add raw and decode property methods to the function
    if (subFunc === 'combine') {
      mainFunc.raw = this.importGenerator<F>(
        path,
        dependencies,
        exportName,
        'raw',
      )
      mainFunc.decode = this.importGenerator<F>(
        path,
        dependencies,
        exportName,
        'decode',
      ) as (data: any, ...args: any[]) => Promise<any>
      mainFunc.batch = this.importGenerator<F>(
        path,
        dependencies,
        exportName,
        'batch',
        { raw: mainFunc.raw as any, decode: mainFunc.decode as any },
      )
    } else if (subFunc === 'write') {
      mainFunc.populateTransaction = this.importGenerator<F>(
        path,
        dependencies,
        exportName,
        'populateTransaction',
      )
    }

    return mainFunc as Function
  }

  /**
   * Generates a normal wrapped function
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @returns {OmitFirstArg} - The generated wrapped function
   */
  private generateFunction = <F>(
    path: string,
    dependencies: FunctionDeps<F>,
    exportName: string = 'default',
  ): OmitFirstArg<F> =>
    this.importGenerator<F>(path, dependencies, exportName) as OmitFirstArg<F>

  /**
   * Generates a write wrapped function
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @returns {OmitFirstArg} - The generated wrapped function
   */
  private generateWriteFunction = <F extends (...args: any) => any>(
    path: string,
    dependencies: FunctionDeps<F>,
    exportName: string = 'default',
  ): WriteFunction<F> =>
    this.importGenerator<F>(
      path,
      dependencies,
      exportName,
      'write',
    ) as WriteFunction<F>

  /**
   * Generates a wrapped function from raw and decode exports
   * @param {string} path - The path of the exported function
   * @param {FunctionDeps} dependencies - An array of ENS properties
   * @param {string} exportName - The export name of the target function
   * @returns {GeneratedRawFunction} - The generated wrapped function
   */
  private generateRawFunction = <F extends RawFunction>(
    path: string,
    dependencies: FunctionDeps<F['raw']> | FunctionDeps<F['decode']>,
    exportName: string = 'default',
  ): GeneratedRawFunction<F> =>
    this.importGenerator<F>(
      path,
      dependencies as any,
      exportName,
      'combine',
    ) as GeneratedRawFunction<F>

  /**
   * Sets the provider for the ENS class
   * @param {ethers.providers.JsonRpcProvider} provider - The provider to set
   * @returns {Promise<void>} - A promise that resolves when the provider is set
   */
  public setProvider = async (
    provider: ethers.providers.JsonRpcProvider,
  ): Promise<void> => {
    this.provider = provider
    const network = (await this.provider.getNetwork()).chainId
    if (this.options && this.options.graphURI) {
      this.graphURI = this.options.graphURI
    } else {
      this.graphURI = graphURIEndpoints[network]
    }
    await this.gqlInstance.setUrl(this.graphURI)
    this.contracts = new ContractManager(
      this.provider,
      this.getContractAddress(String(network) as SupportedNetworkId),
    )
  }

  /**
   * Creates a new ENS instance with a different provider, ideally should be used individually with any given function
   * @param {ethers.providers.JsonRpcProvider} provider - The provider to use
   * @returns {ENS} - A new ENS instance with the given provider
   */
  public withProvider = (provider: ethers.providers.JsonRpcProvider): ENS => {
    const newENS = new ENS(this.options)
    newENS.initialProvider = provider
    return newENS
  }

  public batch = this.generateRawFunction<typeof batch>(
    'initialGetters',
    ['multicallWrapper'],
    'batch',
  )

  public getProfile = this.generateFunction<typeof getProfile>(
    'initialGetters',
    [
      'contracts',
      'gqlInstance',
      'getName',
      'resolverMulticallWrapper',
      'multicallWrapper',
      '_getAddr',
      '_getContentHash',
      '_getText',
    ],
    'getProfile',
  )

  public getRecords = this.generateFunction<typeof getRecords>(
    'initialGetters',
    ['getProfile'],
    'getRecords',
  )

  public getName = this.generateRawFunction<typeof getName>(
    'initialGetters',
    ['contracts'],
    'getName',
  )

  public getResolver = this.generateRawFunction<typeof getResolver>(
    'getResolver',
    ['contracts'],
  )

  public getFuses = this.generateRawFunction<typeof getFuses>('getFuses', [
    'contracts',
  ])

  public getHistory = this.generateFunction<typeof getHistory>(
    'getHistory',
    ['gqlInstance'],
    'getHistory',
  )

  public getContentHash = this.generateRawFunction<typeof getContentHash>(
    'initialGetters',
    ['contracts', 'universalWrapper'],
    'getContentHash',
  )

  public _getContentHash = this.generateRawFunction<typeof _getContentHash>(
    'initialGetters',
    ['contracts'],
    '_getContentHash',
  )

  public getAddr = this.generateRawFunction<typeof getAddr>(
    'initialGetters',
    ['contracts', 'universalWrapper'],
    'getAddr',
  )

  public _getAddr = this.generateRawFunction<typeof _getAddr>(
    'initialGetters',
    ['contracts'],
    '_getAddr',
  )

  public getText = this.generateRawFunction<typeof getText>(
    'initialGetters',
    ['contracts', 'universalWrapper'],
    'getText',
  )

  public _getText = this.generateRawFunction<typeof _getText>(
    'initialGetters',
    ['contracts'],
    '_getText',
  )

  public getOwner = this.generateRawFunction<typeof getOwner>(
    'initialGetters',
    ['contracts', 'multicallWrapper'],
    'getOwner',
  )

  public getExpiry = this.generateRawFunction<typeof getExpiry>(
    'initialGetters',
    ['contracts', 'multicallWrapper'],
    'getExpiry',
  )

  public getSubnames = this.generateFunction<typeof getSubnames>(
    'initialGetters',
    ['gqlInstance'],
    'getSubnames',
  )

  public getNames = this.generateFunction<typeof getNames>(
    'initialGetters',
    ['gqlInstance'],
    'getNames',
  )

  public getPrice = this.generateRawFunction<typeof getPrice>(
    'initialGetters',
    ['contracts', 'multicallWrapper'],
    'getPrice',
  )

  public getDNSOwner = this.generateFunction<typeof getDNSOwner>(
    'getDNSOwner',
    [],
  )

  public universalWrapper = this.generateRawFunction<typeof universalWrapper>(
    'initialGetters',
    ['contracts'],
    'universalWrapper',
  )

  public resolverMulticallWrapper = this.generateRawFunction<
    typeof resolverMulticallWrapper
  >('initialGetters', ['contracts'], 'resolverMulticallWrapper')

  public multicallWrapper = this.generateRawFunction<typeof multicallWrapper>(
    'initialGetters',
    ['contracts'],
    'multicallWrapper',
  )

  public setName = this.generateWriteFunction<typeof setName>('setName', [
    'contracts',
  ])

  public setRecords = this.generateWriteFunction<typeof setRecords>(
    'setRecords',
    ['contracts', 'provider', 'getResolver'],
  )

  public setRecord = this.generateWriteFunction<typeof setRecord>('setRecord', [
    'contracts',
    'provider',
    'getResolver',
  ])

  public setResolver = this.generateWriteFunction<typeof setResolver>(
    'setResolver',
    ['contracts'],
  )

  public transferName = this.generateWriteFunction<typeof transferName>(
    'transferName',
    ['contracts'],
  )

  public wrapName = this.generateWriteFunction<typeof wrapName>('wrapName', [
    'contracts',
    'getExpiry',
  ])

  public unwrapName = this.generateWriteFunction<typeof unwrapName>(
    'unwrapName',
    ['contracts'],
  )

  public burnFuses = this.generateWriteFunction<typeof burnFuses>('burnFuses', [
    'contracts',
  ])

  public createSubname = this.generateWriteFunction<typeof createSubname>(
    'createSubname',
    ['contracts', 'getExpiry'],
  )

  public deleteSubname = this.generateWriteFunction<typeof deleteSubname>(
    'deleteSubname',
    ['contracts'],
  )

  public transferSubname = this.generateWriteFunction<typeof transferSubname>(
    'transferSubname',
    ['contracts', 'getExpiry'],
  )

  public commitName = this.generateWriteFunction<typeof commitName>(
    'commitName',
    ['contracts'],
  )

  public registerName = this.generateWriteFunction<typeof registerName>(
    'registerName',
    ['contracts'],
  )

  public renewNames = this.generateWriteFunction<typeof renewNames>(
    'renewNames',
    ['contracts'],
  )
}
