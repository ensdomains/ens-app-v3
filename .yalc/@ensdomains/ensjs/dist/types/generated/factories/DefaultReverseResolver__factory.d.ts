import { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import type { DefaultReverseResolver, DefaultReverseResolverInterface } from '../DefaultReverseResolver';
export declare class DefaultReverseResolver__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        constant?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        constant: boolean;
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): DefaultReverseResolverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DefaultReverseResolver;
}
