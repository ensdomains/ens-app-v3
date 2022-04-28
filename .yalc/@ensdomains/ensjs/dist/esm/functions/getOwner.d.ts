import { ENSArgs } from '..';
declare const _default: {
    raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, name: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string, name: string) => Promise<{
        owner: any;
        ownershipLevel: string;
        registrant?: undefined;
    } | {
        registrant: any;
        owner: any;
        ownershipLevel: string;
    } | null>;
};
export default _default;
