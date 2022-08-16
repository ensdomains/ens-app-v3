export declare const enter: (node: any) => any;
export declare const requestMiddleware: (visit: any, parse: any) => (request: any) => any;
export declare const responseMiddleware: (traverse: any) => (response: any) => any;
export default class GqlManager {
    gql: any;
    client?: any | null;
    setUrl: (url: string | null) => Promise<void>;
    request: (...arg: any[]) => any;
}
