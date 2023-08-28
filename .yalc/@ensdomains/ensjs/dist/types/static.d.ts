import type { StaticJsonRpcProvider } from '@ethersproject/providers';
import { gql, GraphQLClient } from 'graphql-request';
import { ENS, FunctionSubtype } from './index';
import type Factories from './contracts/factories';
import type FunctionTypes from './functions/types';
declare type Options = ConstructorParameters<typeof ENS>[0] & {
    functions: Partial<FunctionTypes>;
    contracts: Partial<Factories>;
};
declare class StaticENS extends ENS {
    private functions;
    private contractsObject;
    gqlInstance: {
        client: GraphQLClient | {
            request: () => Promise<null>;
        };
        setUrl: () => Promise<void>;
        gql: typeof gql | ((query: TemplateStringsArray) => string);
    };
    constructor(provider: StaticJsonRpcProvider, { functions, contracts, ...options }: Options);
    setStaticProvider: (provider: StaticJsonRpcProvider) => void;
    setProvider: (provider: StaticJsonRpcProvider) => Promise<void>;
    protected getModule: () => Promise<Partial<FunctionTypes>>;
    protected getFunction: (subFunc: FunctionSubtype | undefined, _writeable: boolean | undefined, exportName: string, mod: any, path: string) => any;
}
export default StaticENS;
