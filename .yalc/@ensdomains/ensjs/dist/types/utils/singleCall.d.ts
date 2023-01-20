import type { Provider } from '@ethersproject/providers';
declare const _default: (provider: Provider, ensData: any, func: {
    raw: (...args: any[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: (...args: any[]) => Promise<any>;
}, ...data: any[]) => Promise<any>;
export default _default;
