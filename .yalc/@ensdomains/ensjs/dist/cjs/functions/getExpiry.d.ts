import { ENSArgs } from '..';
declare const _default: {
    raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, name: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string) => Promise<{
        expiry: Date | null;
        gracePeriod: number;
    } | undefined>;
};
export default _default;
