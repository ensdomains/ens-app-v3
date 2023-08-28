import {
  ContractTransaction,
  PopulatedTransaction,
} from '@ethersproject/contracts'
import type {
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
} from '@ethersproject/providers'
import { getContractAddress as _getContractAddress } from './contracts/getContractAddress'
import ContractManager from './contracts/index'
import { SupportedNetworkId } from './contracts/types'
import type FunctionTypes from './functions/types'
import GqlManager from './GqlManager'
import singleCall from './utils/singleCall'
import writeTx from './utils/writeTx'

export type { ChildFuses, ParentFuses } from './utils/fuses'

type ENSOptions = {
  graphURI?: string | null
  getContractAddress?: typeof _getContractAddress
}

export type InternalENS = {
  options?: ENSOptions
  provider?: Provider
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
export const graphURIEndpoints: Record<string, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
  11155111:
    'https://api.studio.thegraph.com/query/49574/enssepolia/version/latest',
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

interface GeneratedBatchFunction<F extends RawFunction>
  extends Function,
    RawFunction {
  <I extends BatchFunctionResult<RawFunction>[]>(...args: I): Promise<
    | {
        [N in keyof I]: I[N] extends BatchFunctionResult<infer U>
          ? Awaited<ReturnType<U['decode']>>
          : never
      }
    | undefined
  >
  batch: BatchFunction<F>
}

export type FunctionSubtype =
  | 'raw'
  | 'decode'
  | 'combine'
  | 'batch'
  | 'write'
  | 'populateTransaction'

export class ENS {
  [x: string]: any

  protected options?: ENSOptions

  protected provider?: JsonRpcProvider

  protected graphURI?: string | null

  protected initialProvider?: JsonRpcProvider

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
  protected forwardDependenciesFromArray = <F>(
    dependencies: FunctionDeps<F>,
  ): object =>
    // Creates an object from entries of the array
    Object.fromEntries(
      // Maps over dependencies and create arrays for each, e.g. ['contracts', contractObj]
      dependencies.map((dep) => [dep, this[dep as keyof InternalENS]]),
    )

  // eslint-disable-next-line class-methods-use-this
  protected getModule = async (path: string, exportName: string) => {
    let mod = await import(
      /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true, webpackExclude: /.*\.ts$/ */
      `./functions/${path}`
    )

    // if export is nested in default, use default
    if (mod.default?.[exportName]) {
      mod = mod.default
    }
    return mod
  }

  // eslint-disable-next-line class-methods-use-this
  protected getFunction = (
    subFunc: FunctionSubtype | undefined,
    writeable: boolean | undefined,
    exportName: string,
    mod: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _path: string,
  ) => (subFunc && !writeable ? mod[exportName][subFunc] : mod[exportName])

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
    subFunc?: FunctionSubtype,
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
      const mod = await thisRef.getModule(path, exportName)

      // if combine isn't specified, run normally
      // otherwise, create a function from the raw and decode functions
      if (subFunc !== 'combine') {
        const writeable =
          subFunc === 'write' || subFunc === 'populateTransaction'
        // get the function to call
        const func = thisRef.getFunction(
          subFunc,
          writeable,
          exportName,
          mod,
          path,
        )
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
        thisRef.getFunction(undefined, undefined, exportName, mod, path),
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
   * @param {JsonRpcProvider} provider - The provider to set
   * @returns {Promise<void>} - A promise that resolves when the provider is set
   */
  public setProvider = async (provider: JsonRpcProvider): Promise<void> => {
    this.provider = provider
    const network = this.staticNetwork
      ? this.provider._network.chainId
      : (await this.provider.getNetwork()).chainId
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
   * @param {JsonRpcProvider} provider - The provider to use
   * @returns {ENS} - A new ENS instance with the given provider
   */
  public withProvider = (provider: JsonRpcProvider): ENS => {
    const newENS = new ENS(this.options)
    newENS.initialProvider = provider
    return newENS
  }

  public batch = this.generateRawFunction<FunctionTypes['batch']>(
    'initialGetters',
    ['multicallWrapper'],
    'batch',
  ) as GeneratedBatchFunction<FunctionTypes['batch']>

  public getProfile = this.generateFunction<FunctionTypes['getProfile']>(
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

  public getName = this.generateRawFunction<FunctionTypes['getName']>(
    'initialGetters',
    ['contracts'],
    'getName',
  )

  public getResolver = this.generateRawFunction<FunctionTypes['getResolver']>(
    'getResolver',
    ['contracts'],
  )

  public getWrapperData = this.generateRawFunction<
    FunctionTypes['getWrapperData']
  >('getWrapperData', ['contracts'])

  public getHistory = this.generateFunction<FunctionTypes['getHistory']>(
    'getHistory',
    ['gqlInstance'],
    'getHistory',
  )

  public getContentHash = this.generateRawFunction<
    FunctionTypes['getContentHash']
  >('initialGetters', ['contracts', 'universalWrapper'], 'getContentHash')

  public _getContentHash = this.generateRawFunction<
    FunctionTypes['_getContentHash']
  >('initialGetters', ['contracts'], '_getContentHash')

  public getAddr = this.generateRawFunction<FunctionTypes['getAddr']>(
    'initialGetters',
    ['contracts', 'universalWrapper'],
    'getAddr',
  )

  public _getAddr = this.generateRawFunction<FunctionTypes['_getAddr']>(
    'initialGetters',
    ['contracts'],
    '_getAddr',
  )

  public getText = this.generateRawFunction<FunctionTypes['getText']>(
    'initialGetters',
    ['contracts', 'universalWrapper'],
    'getText',
  )

  public _getText = this.generateRawFunction<FunctionTypes['_getText']>(
    'initialGetters',
    ['contracts'],
    '_getText',
  )

  public getABI = this.generateRawFunction<FunctionTypes['getABI']>(
    'initialGetters',
    ['contracts', 'universalWrapper'],
    'getABI',
  )

  public _getABI = this.generateRawFunction<FunctionTypes['_getABI']>(
    'initialGetters',
    ['contracts'],
    '_getABI',
  )

  public getOwner = this.generateRawFunction<FunctionTypes['getOwner']>(
    'initialGetters',
    ['contracts', 'multicallWrapper', 'gqlInstance'],
    'getOwner',
  )

  public getExpiry = this.generateRawFunction<FunctionTypes['getExpiry']>(
    'initialGetters',
    ['contracts', 'multicallWrapper'],
    'getExpiry',
  )

  public getSubnames = this.generateFunction<FunctionTypes['getSubnames']>(
    'initialGetters',
    ['gqlInstance', 'contracts'],
    'getSubnames',
  )

  public getNames = this.generateFunction<FunctionTypes['getNames']>(
    'initialGetters',
    ['gqlInstance'],
    'getNames',
  )

  public getPrice = this.generateRawFunction<FunctionTypes['getPrice']>(
    'initialGetters',
    ['contracts', 'multicallWrapper'],
    'getPrice',
  )

  public getDNSOwner = this.generateFunction<FunctionTypes['getDNSOwner']>(
    'getDNSOwner',
    [],
  )

  public supportsTLD = this.generateFunction<FunctionTypes['supportsTLD']>(
    'initialGetters',
    ['getOwner', 'provider'],
    'supportsTLD',
  )

  public getAvailable = this.generateRawFunction<FunctionTypes['getAvailable']>(
    'getAvailable',
    ['contracts'],
  )

  public getDecryptedName = this.generateRawFunction<
    FunctionTypes['getDecryptedName']
  >('getDecryptedName', ['contracts', 'gqlInstance'])

  public universalWrapper = this.generateRawFunction<
    FunctionTypes['universalWrapper']
  >('initialGetters', ['contracts'], 'universalWrapper')

  public resolverMulticallWrapper = this.generateRawFunction<
    FunctionTypes['resolverMulticallWrapper']
  >('initialGetters', ['contracts'], 'resolverMulticallWrapper')

  public multicallWrapper = this.generateRawFunction<
    FunctionTypes['multicallWrapper']
  >('initialGetters', ['contracts', 'provider'], 'multicallWrapper')

  public setName = this.generateWriteFunction<FunctionTypes['setName']>(
    'setName',
    ['contracts'],
  )

  public setRecords = this.generateWriteFunction<FunctionTypes['setRecords']>(
    'setRecords',
    ['contracts', 'provider', 'getResolver'],
  )

  public setRecord = this.generateWriteFunction<FunctionTypes['setRecord']>(
    'setRecord',
    ['contracts', 'provider', 'getResolver'],
  )

  public setResolver = this.generateWriteFunction<FunctionTypes['setResolver']>(
    'setResolver',
    ['contracts'],
  )

  public transferName = this.generateWriteFunction<
    FunctionTypes['transferName']
  >('transferName', ['contracts'])

  public transferController = this.generateWriteFunction<
    FunctionTypes['transferController']
  >('transferController', ['contracts'])

  public wrapName = this.generateWriteFunction<FunctionTypes['wrapName']>(
    'wrapName',
    ['contracts'],
  )

  public unwrapName = this.generateWriteFunction<FunctionTypes['unwrapName']>(
    'unwrapName',
    ['contracts'],
  )

  public setFuses = this.generateWriteFunction<FunctionTypes['setFuses']>(
    'setFuses',
    ['contracts'],
  )

  public setChildFuses = this.generateWriteFunction<
    FunctionTypes['setChildFuses']
  >('setFuses', ['contracts'], 'setChildFuses')

  public importDNSSECName = this.generateWriteFunction<
    FunctionTypes['importDNSSECName']
  >('importDNSSECName', ['contracts', 'provider', 'signer'])

  public createSubname = this.generateWriteFunction<
    FunctionTypes['createSubname']
  >('createSubname', ['contracts', 'getExpiry'])

  public deleteSubname = this.generateWriteFunction<
    FunctionTypes['deleteSubname']
  >('deleteSubname', ['contracts'])

  public transferSubname = this.generateWriteFunction<
    FunctionTypes['transferSubname']
  >('transferSubname', ['contracts'])

  public commitName = this.generateWriteFunction<FunctionTypes['commitName']>(
    'commitName',
    ['contracts'],
  )

  public registerName = this.generateWriteFunction<
    FunctionTypes['registerName']
  >('registerName', ['contracts'])

  public renewNames = this.generateWriteFunction<FunctionTypes['renewNames']>(
    'renewNames',
    ['contracts'],
  )

  public extendWrappedName = this.generateWriteFunction<
    FunctionTypes['extendWrappedName']
  >('renewNames', ['contracts'], 'extendWrappedName')
}
