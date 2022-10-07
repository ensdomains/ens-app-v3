import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { RSASHA1Algorithm, RSASHA1AlgorithmInterface } from "../RSASHA1Algorithm";
export declare class RSASHA1Algorithm__factory {
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
    static createInterface(): RSASHA1AlgorithmInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RSASHA1Algorithm;
}
