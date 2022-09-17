import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { SHA1NSEC3Digest, SHA1NSEC3DigestInterface } from "../SHA1NSEC3Digest";
export declare class SHA1NSEC3Digest__factory {
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
    static createInterface(): SHA1NSEC3DigestInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SHA1NSEC3Digest;
}
