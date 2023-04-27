// src/static.ts
import { gql, GraphQLClient } from "graphql-request";
import { parse, print, visit } from "graphql/language";
import traverse from "traverse";
import ContractManager from "./contracts/index.mjs";
import { ENS, graphURIEndpoints } from "./index.mjs";
import { requestMiddleware, responseMiddleware } from "./GqlManager.mjs";
var StaticENS = class extends ENS {
  functions;
  contractsObject;
  gqlInstance = {
    client: { request: () => Promise.resolve(null) },
    setUrl: () => Promise.resolve(),
    gql: (query) => query.join()
  };
  constructor(provider, { functions, contracts, ...options }) {
    super(options);
    this.functions = functions;
    this.contractsObject = contracts;
    this.setStaticProvider(provider);
  }
  setStaticProvider = (provider) => {
    this.provider = provider;
    const network = provider.network.chainId;
    if (this.options && this.options.graphURI) {
      this.graphURI = this.options.graphURI;
    } else {
      this.graphURI = graphURIEndpoints[network];
    }
    if (this.graphURI) {
      const client = new GraphQLClient(this.graphURI, {
        requestMiddleware: requestMiddleware(visit, parse, print),
        responseMiddleware: responseMiddleware(traverse)
      });
      this.gqlInstance = {
        client,
        setUrl: () => Promise.resolve(),
        gql
      };
    }
    this.contracts = new ContractManager(
      provider,
      this.getContractAddress(String(network)),
      (name) => Promise.resolve(this.contractsObject[name])
    );
  };
  setProvider = async (provider) => {
    this.setStaticProvider(provider);
  };
  getModule = async () => this.functions;
  getFunction = (subFunc, _writeable, exportName, mod, path) => {
    const base = mod[exportName === "default" ? path : exportName];
    if (subFunc === "raw" || subFunc === "decode") {
      return base[subFunc];
    }
    return base;
  };
};
var static_default = StaticENS;
export {
  static_default as default
};
