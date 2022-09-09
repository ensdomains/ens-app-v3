import { ENSArgs } from '..';
declare const _default: {
    raw: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, name: string) => Promise<{}>;
    decode: ({ contracts, multicallWrapper }: ENSArgs<"contracts" | "multicallWrapper">, data: string, name: string) => Promise<{
        isOldDNSRegistrar: any;
        isNewDNSRegistrar: any;
        tldOwner: any;
    } | undefined>;
};
export default _default;
