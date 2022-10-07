import { BigNumber } from 'ethers';
import { ENSArgs } from '../index';
import { CurrentFuses } from '../utils/fuses';
declare const _default: {
    raw: ({ contracts }: ENSArgs<"contracts">, name: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<"contracts">, data: string) => Promise<{
        fuseObj: CurrentFuses;
        expiryDate: Date;
        rawFuses: BigNumber;
        owner: any;
    } | undefined>;
};
export default _default;
