import { ENSArgs } from '..';
declare type Params = {
    name: string;
    page?: number;
    pageSize?: number;
    orderDirection?: 'asc' | 'desc';
    orderBy?: 'createdAt' | 'labelName';
    lastSubnames: Array<any>;
    isLargeQuery?: boolean;
};
declare const getSubnames: (injected: ENSArgs<'gqlInstance'>, functionArgs: Params) => Promise<{
    subnames: any;
    subnameCount: any;
}>;
export default getSubnames;
