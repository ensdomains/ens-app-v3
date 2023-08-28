import { ENSArgs } from '..';
import { AllCurrentFuses } from '../utils/fuses';
declare type BaseSubname = {
    id: string;
    labelName: string | null;
    truncatedName?: string;
    labelhash: string;
    isMigrated: boolean;
    name: string;
    owner: string | undefined;
};
declare type UnwrappedSubname = BaseSubname & {
    fuses?: never;
    expiryDate?: never;
    pccExpired?: never;
    type: 'domain';
};
declare type WrappedSubname = BaseSubname & {
    fuses: AllCurrentFuses;
    expiryDate: Date;
    pccExpired: boolean;
    type: 'wrappedDomain';
};
declare type Subname = WrappedSubname | UnwrappedSubname;
declare type ReturnData = {
    subnames: Subname[];
    subnameCount: number;
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
declare const getSubnames: (injected: ENSArgs<'gqlInstance' | 'contracts'>, functionArgs: Params) => Promise<ReturnData>;
export default getSubnames;
