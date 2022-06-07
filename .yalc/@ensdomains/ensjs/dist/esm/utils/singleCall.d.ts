import { ethers } from 'ethers';
declare const _default: (provider: ethers.providers.Provider, ensData: any, func: {
    raw: (...args: any[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: (...args: any[]) => Promise<any>;
}, ...data: any[]) => Promise<any>;
export default _default;
