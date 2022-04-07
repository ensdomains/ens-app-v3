import { ethers } from 'ethers'
import ContractManager from './contracts'
import type { batch, _batch } from './functions/batch'
import type {
  resolverMulticallWrapper,
  universalWrapper,
} from './functions/batchWrappers'
import type burnFuses from './functions/burnFuses'
import type createSubname from './functions/createSubname'
import deleteSubname from './functions/deleteSubname'
import type getFuses from './functions/getFuses'
import type {
  getHistory,
  getHistoryDetailForTransactionHash,
  getHistoryWithDetail,
} from './functions/getHistory'
import type getName from './functions/getName'
import type { getOwner } from './functions/getOwner'
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
import type setName from './functions/setName'
import type setRecords from './functions/setRecords'
import type setResolver from './functions/setResolver'
import type transferName from './functions/transferName'
import type unwrapName from './functions/unwrapName'
import type wrapName from './functions/wrapName'
import GqlManager from './GqlManager'
import singleCall from './utils/singleCall'

type ENSOptions = {
  graphURI?: string | null
}

export type InternalENS = {
  options?: ENSOptions
  provider?: ethers.providers.Provider
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

const graphURIEndpoints: Record<string, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
  3: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensropsten',
  4: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensrinkeby',
  5: 'https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli',
}

export type RawFunction = {
  raw: (...args: any[]) => Promise<{ to: string; data: string }>
  decode: (...args: any[]) => Promise<any>
}

interface GeneratedRawFunction<F extends RawFunction>
  extends Function,
    RawFunction {
  (...args: Parameters<OmitFirstArg<F['raw']>>): ReturnType<
    OmitFirstTwoArgs<F['decode']>
  >
}

type CombineFunctionDeps<F> = F extends RawFunction
  ? FunctionDeps<F['raw']> | FunctionDeps<F['decode']>
  : never

export interface GenericGeneratedRawFunction extends Function, RawFunction {}

export class ENS {
  [x: string]: any
  protected options?: ENSOptions
  protected provider?: ethers.providers.JsonRpcProvider
  protected graphURI?: string | null
  protected initialProvider?: ethers.providers.JsonRpcProvider
  contracts?: ContractManager
  gqlInstance = new GqlManager()

  constructor(options?: ENSOptions) {
    this.options = options
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
    return
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
    subFunc?: 'raw' | 'decode' | 'combine',
  ): Function => {
    const thisRef = this
    const mainFunc = async function (...args: any[]) {
      // check the initial provider and set if it exists
      await thisRef.checkInitialProvider()
      // import the module dynamically
      const mod = await import(
        /* webpackMode: "lazy", webpackChunkName: "[request]", webpackPreload: true */
        `./functions/${path}`
      )

      // if combine isn't specified, run normally'
      // otherwise, create a function from the raw and decode functions
      if (subFunc !== 'combine') {
        // get the function to call
        const func = subFunc ? mod[exportName][subFunc] : mod[exportName]
        // get the dependencies to forward to the function as the first arg
        const dependenciesToForward =
          thisRef.forwardDependenciesFromArray<F>(dependencies)
        // return the function with the dependencies forwarded
        return func(dependenciesToForward, ...args)
      } else {
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
    if (this.options && this.options.graphURI) {
      this.graphURI = this.options.graphURI
    } else {
      this.graphURI =
        graphURIEndpoints[(await this.provider.getNetwork()).chainId]
    }
    await this.gqlInstance.setUrl(this.graphURI)
    this.contracts = new ContractManager(this.provider)
    return
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

  public batch = this.generateFunction<typeof batch>(
    'batch',
    ['contracts'],
    'batch',
  )
  public _batch = this.generateFunction<typeof _batch>(
    'batch',
    ['contracts'],
    '_batch',
  )

  public getProfile = this.generateFunction<typeof getProfile>('getProfile', [
    'contracts',
    'gqlInstance',
    'getName',
    'resolverMulticallWrapper',
    '_getAddr',
    '_getContentHash',
    '_getText',
  ])

  public getRecords = this.generateFunction<typeof getRecords>('getRecords', [
    'getProfile',
  ])

  public getName = this.generateRawFunction<typeof getName>('getName', [
    'contracts',
  ])

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

  public getHistoryWithDetail = this.generateFunction<
    typeof getHistoryWithDetail
  >(
    'getHistory',
    ['contracts', 'gqlInstance', 'provider'],
    'getHistoryWithDetail',
  )

  public getHistoryDetailForTransactionHash = this.generateFunction<
    typeof getHistoryDetailForTransactionHash
  >(
    'getHistory',
    ['contracts', 'provider'],
    'getHistoryDetailForTransactionHash',
  )

  public getContentHash = this.generateRawFunction<typeof getContentHash>(
    'getSpecificRecord',
    ['contracts', 'universalWrapper'],
    'getContentHash',
  )

  public _getContentHash = this.generateRawFunction<typeof _getContentHash>(
    'getSpecificRecord',
    ['contracts'],
    '_getContentHash',
  )

  public getAddr = this.generateRawFunction<typeof getAddr>(
    'getSpecificRecord',
    ['contracts', 'universalWrapper'],
    'getAddr',
  )

  public _getAddr = this.generateRawFunction<typeof _getAddr>(
    'getSpecificRecord',
    ['contracts'],
    '_getAddr',
  )

  public getText = this.generateRawFunction<typeof getText>(
    'getSpecificRecord',
    ['contracts', 'universalWrapper'],
    'getText',
  )

  public _getText = this.generateRawFunction<typeof _getText>(
    'getSpecificRecord',
    ['contracts'],
    '_getText',
  )

  public _getOwner = this.generateFunction<typeof getOwner>(
    'getOwner',
    ['contracts'],
    '_getOwner',
  )

  public getOwner = this.generateFunction<typeof getOwner>(
    'getOwner',
    ['contracts'],
    'getOwner',
  )

  public universalWrapper = this.generateRawFunction<typeof universalWrapper>(
    'batchWrappers',
    ['contracts'],
    'universalWrapper',
  )

  public resolverMulticallWrapper = this.generateRawFunction<
    typeof resolverMulticallWrapper
  >('batchWrappers', ['contracts'], 'resolverMulticallWrapper')

  public setName = this.generateFunction<typeof setName>('setName', [
    'contracts',
    'provider',
  ])

  public setRecords = this.generateFunction<typeof setRecords>('setRecords', [
    'contracts',
    'provider',
    'getResolver',
  ])

  public setResolver = this.generateFunction<typeof setResolver>(
    'setResolver',
    ['contracts', 'provider'],
  )

  public transferName = this.generateFunction<typeof transferName>(
    'transferName',
    ['contracts', 'provider'],
  )

  public wrapName = this.generateFunction<typeof wrapName>('wrapName', [
    'contracts',
    'provider',
  ])

  public unwrapName = this.generateFunction<typeof unwrapName>('unwrapName', [
    'contracts',
    'provider',
  ])

  public burnFuses = this.generateFunction<typeof burnFuses>('burnFuses', [
    'contracts',
    'provider',
  ])

  public createSubname = this.generateFunction<typeof createSubname>(
    'createSubname',
    ['contracts', 'provider'],
  )

  public deleteSubname = this.generateFunction<typeof deleteSubname>(
    'deleteSubname',
    ['contracts', 'provider'],
  )
}
