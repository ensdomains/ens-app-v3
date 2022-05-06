import { ENSArgs } from '..';
declare type Subname = {
    id: string;
    labelName: string | null;
    truncatedName?: string;
    labelhash: string;
    isMigrated: boolean;
    name: string;
    owner: {
        id: string;
    };
};
declare type Params = {
    name: string;
    page?: number;
    pageSize?: number;
    orderDirection?: 'asc' | 'desc';
    orderBy?: 'createdAt' | 'labelName';
};
declare const getSubnames: ({ gqlInstance }: ENSArgs<'gqlInstance'>, { name, page, pageSize, orderDirection, orderBy }: Params) => Promise<Subname[]>;
export default getSubnames;
