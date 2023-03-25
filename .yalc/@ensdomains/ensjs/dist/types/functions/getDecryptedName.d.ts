import { ENSArgs } from '../index';
declare const _default: {
    raw: ({ contracts }: ENSArgs<"contracts">, name: string, allowIncomplete?: boolean | undefined) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts, gqlInstance }: ENSArgs<"contracts" | "gqlInstance">, data: string, name: string, allowIncomplete?: boolean) => Promise<any>;
};
export default _default;
