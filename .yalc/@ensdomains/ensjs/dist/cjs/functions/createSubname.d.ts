import { ethers } from 'ethers';
import { ENSArgs } from '..';
import { FuseOptions } from '../@types/FuseOptions';
declare type BaseArgs = {
    name: string;
    owner: string;
    resolverAddress?: string;
    contract: 'registry' | 'nameWrapper';
    options?: {
        addressOrIndex?: string | number;
    };
};
declare type NameWrapperArgs = {
    contract: 'nameWrapper';
    fuses?: FuseOptions;
    shouldWrap?: boolean;
} & BaseArgs;
declare type Args = BaseArgs | NameWrapperArgs;
export default function ({ contracts, provider }: ENSArgs<'contracts' | 'provider'>, { name, owner, resolverAddress, contract, options, ...wrapperArgs }: Args): Promise<ethers.ContractTransaction>;
export {};
