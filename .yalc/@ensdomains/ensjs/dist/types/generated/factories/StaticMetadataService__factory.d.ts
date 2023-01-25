import { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import type { StaticMetadataService, StaticMetadataServiceInterface } from '../StaticMetadataService';
export declare class StaticMetadataService__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        name?: undefined;
        outputs?: undefined;
    } | {
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
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): StaticMetadataServiceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): StaticMetadataService;
}
