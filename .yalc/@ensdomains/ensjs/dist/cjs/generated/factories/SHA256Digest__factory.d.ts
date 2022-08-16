import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { SHA256Digest, SHA256DigestInterface } from "../SHA256Digest";
export declare class SHA256Digest__factory {
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
    static createInterface(): SHA256DigestInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): SHA256Digest;
}
