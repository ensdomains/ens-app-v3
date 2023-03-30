import type { parse as Parse, print as Print, SelectionSetNode, visit as Visit } from 'graphql';
import type { gql, GraphQLClient } from 'graphql-request';
import type Traverse from 'traverse';
export declare const enter: (node: SelectionSetNode) => SelectionSetNode | undefined;
export declare const requestMiddleware: (visit: typeof Visit, parse: typeof Parse, print: typeof Print) => (request: any) => any;
export declare const responseMiddleware: (traverse: typeof Traverse) => (response: any) => any;
export default class GqlManager {
    gql: typeof gql | ((query: TemplateStringsArray) => string);
    client: GraphQLClient | {
        request: () => Promise<null>;
    };
    setUrl: (url: string | null) => Promise<void>;
}
