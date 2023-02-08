import { ENSArgs } from '..';
import { AllCurrentFuses } from '../utils/fuses';
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
    fuses?: AllCurrentFuses;
    expiryDate?: Date;
};
declare type Params = {
    name: string;
    page?: number;
    pageSize?: number;
    orderDirection?: 'asc' | 'desc';
    orderBy?: 'createdAt' | 'labelName';
    lastSubnames?: Array<any>;
    search?: string;
};
declare const getSubnames: (injected: ENSArgs<'gqlInstance'>, functionArgs: Params) => Promise<{
    subnames: Subname[];
    subnameCount: number;
}>;
export default getSubnames;
