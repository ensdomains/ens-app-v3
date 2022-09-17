import { ENSArgs } from '..';
declare type ContractOption = 'registrar' | 'nameWrapper';
declare type Args = {
    contract?: ContractOption;
};
declare const _default: {
    raw: (ensArgs: ENSArgs<"contracts" | "multicallWrapper">, name: string, { contract }?: Args) => Promise<{
        to: string;
        data: string;
    }>;
    decode: (ensArgs: ENSArgs<"contracts" | "multicallWrapper">, data: string, name: string, { contract }?: Args) => Promise<{
        expiry: Date;
        gracePeriod: null;
    } | {
        expiry: Date | null;
        gracePeriod: number;
    } | undefined>;
};
export default _default;
