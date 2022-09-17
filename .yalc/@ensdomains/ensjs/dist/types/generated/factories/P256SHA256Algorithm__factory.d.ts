import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { P256SHA256Algorithm, P256SHA256AlgorithmInterface } from "../P256SHA256Algorithm";
export declare class P256SHA256Algorithm__factory {
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
    static createInterface(): P256SHA256AlgorithmInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): P256SHA256Algorithm;
}
