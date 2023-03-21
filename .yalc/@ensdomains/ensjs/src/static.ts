import type { StaticJsonRpcProvider } from '@ethersproject/providers'
import { gql, GraphQLClient } from 'graphql-request'
import { parse, print, visit } from 'graphql/language'
import traverse from 'traverse'
import ContractManager from './contracts/index'
import { SupportedNetworkId } from './contracts/types'
import { ENS, FunctionSubtype, graphURIEndpoints } from './index'

import type Factories from './contracts/factories'
import type FunctionTypes from './functions/types'
import { requestMiddleware, responseMiddleware } from './GqlManager'

type Options = ConstructorParameters<typeof ENS>[0] & {
  functions: Partial<FunctionTypes>
  contracts: Partial<Factories>
}

class StaticENS extends ENS {
  private functions: Partial<FunctionTypes>

  private contractsObject: Partial<Factories>

  gqlInstance: {
    client: GraphQLClient | { request: () => Promise<null> }
    setUrl: () => Promise<void>
    gql: typeof gql | ((query: TemplateStringsArray) => string)
  } = {
    client: { request: () => Promise.resolve(null) },
    setUrl: () => Promise.resolve(),
    gql: (query: TemplateStringsArray) => query.join(),
  }

  constructor(
    provider: StaticJsonRpcProvider,
    { functions, contracts, ...options }: Options,
  ) {
    super(options)
    this.functions = functions
    this.contractsObject = contracts
    this.setStaticProvider(provider)
  }

  public setStaticProvider = (provider: StaticJsonRpcProvider) => {
    this.provider = provider
    const network = provider.network.chainId
    if (this.options && this.options.graphURI) {
      this.graphURI = this.options.graphURI
    } else {
      this.graphURI = graphURIEndpoints[network]
    }
    if (this.graphURI) {
      const client = new GraphQLClient(this.graphURI, {
        requestMiddleware: requestMiddleware(visit, parse, print),
        responseMiddleware: responseMiddleware(traverse),
      })
      this.gqlInstance = {
        client,
        setUrl: () => Promise.resolve(),
        gql,
      }
    }
    this.contracts = new ContractManager(
      provider,
      this.getContractAddress(String(network) as SupportedNetworkId),
      (name) =>
        Promise.resolve(this.contractsObject[name as keyof Factories] as any),
    )
  }

  public override setProvider = async (
    provider: StaticJsonRpcProvider,
  ): Promise<void> => {
    this.setStaticProvider(provider)
  }

  protected override getModule = async () => this.functions

  // eslint-disable-next-line class-methods-use-this
  protected override getFunction = (
    subFunc: FunctionSubtype | undefined,
    _writeable: boolean | undefined,
    exportName: string,
    mod: any,
    path: string,
  ) => {
    const base = mod[exportName === 'default' ? path : exportName]
    if (subFunc === 'raw' || subFunc === 'decode') {
      return base[subFunc]
    }
    return base
  }
}

export default StaticENS
