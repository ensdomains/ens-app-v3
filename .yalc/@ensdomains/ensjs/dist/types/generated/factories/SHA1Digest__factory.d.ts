import { Signer } from '@ethersproject/abstract-signer';
import type { Provider } from '@ethersproject/providers';
import type { SHA1Digest, SHA1DigestInterface } from '../SHA1Digest';
export declare class SHA1Digest__factory {
    static readonly abi: {
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
    }[];
    static createInterface(): SHA1DigestInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SHA1Digest;
}
