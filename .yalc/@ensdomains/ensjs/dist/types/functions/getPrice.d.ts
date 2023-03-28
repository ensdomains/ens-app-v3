import { BigNumber } from '@ethersproject/bignumber';
import { ENSArgs } from '..';
declare const _default: {
    raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, nameOrNames: string | string[], duration: number, legacy?: boolean | undefined) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string, _nameOrNames: string | string[], _duration: number, legacy?: boolean | undefined) => Promise<{
        base: BigNumber;
        premium: BigNumber;
    } | undefined>;
};
export default _default;
