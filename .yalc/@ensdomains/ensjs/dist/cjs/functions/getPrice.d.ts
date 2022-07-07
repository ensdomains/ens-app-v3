import { BigNumber } from 'ethers';
import { ENSArgs } from '..';
declare const _default: {
    raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, name: string, duration: number, legacy?: boolean | undefined) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string, _name: string, _number: number, legacy?: boolean | undefined) => Promise<{
        base: BigNumber;
        premium: BigNumber;
    } | undefined>;
};
export default _default;
