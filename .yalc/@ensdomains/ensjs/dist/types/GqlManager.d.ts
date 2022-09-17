import type { parse as Parse, print as Print, SelectionSetNode, visit as Visit } from 'graphql';
import type Traverse from 'traverse';
export declare const enter: (node: SelectionSetNode) => SelectionSetNode | undefined;
export declare const requestMiddleware: (visit: typeof Visit, parse: typeof Parse, print: typeof Print) => (request: any) => any;
export declare const responseMiddleware: (traverse: typeof Traverse) => (response: any) => any;
export default class GqlManager {
    gql: any;
    client?: any | null;
    setUrl: (url: string | null) => Promise<void>;
    request: (...arg: any[]) => any;
}
