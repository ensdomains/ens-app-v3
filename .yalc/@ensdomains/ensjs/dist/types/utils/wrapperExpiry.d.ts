import { BigNumber } from 'ethers';
import { ENSArgs } from '..';
export declare type Expiry = string | number | Date | BigNumber;
export declare const MAX_EXPIRY: BigNumber;
export declare const makeExpiry: ({ getExpiry }: ENSArgs<'getExpiry'>, name: string, expiry?: Expiry) => Promise<BigNumber>;
