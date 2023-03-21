import { ENSArgs } from '../index';
declare const _default: {
    raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<{
        expiryDate: Date | undefined;
        rawFuses: number;
        owner: string;
        parent: {
            unnamed: {
                524288: boolean;
                1048576: boolean;
                2097152: boolean;
                4194304: boolean;
                8388608: boolean;
                16777216: boolean;
                33554432: boolean;
                67108864: boolean;
                134217728: boolean;
                268435456: boolean;
                536870912: boolean;
                1073741824: boolean;
                2147483648: boolean;
            };
            IS_DOT_ETH: boolean;
            PARENT_CANNOT_CONTROL: boolean;
            CAN_EXTEND_EXPIRY: boolean;
        };
        child: {
            CAN_DO_EVERYTHING: boolean;
            unnamed: {
                1024: boolean;
                128: boolean;
                256: boolean;
                512: boolean;
                2048: boolean;
                4096: boolean;
                8192: boolean;
                16384: boolean;
                32768: boolean;
            };
            CANNOT_UNWRAP: boolean;
            CANNOT_BURN_FUSES: boolean;
            CANNOT_TRANSFER: boolean;
            CANNOT_SET_RESOLVER: boolean;
            CANNOT_SET_TTL: boolean;
            CANNOT_CREATE_SUBDOMAIN: boolean;
            CANNOT_APPROVE: boolean;
        };
    } | undefined>;
};
export default _default;
