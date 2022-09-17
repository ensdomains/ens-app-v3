import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { RSASHA256Algorithm, RSASHA256AlgorithmInterface } from "../RSASHA256Algorithm";
export declare class RSASHA256Algorithm__factory {
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
    static createInterface(): RSASHA256AlgorithmInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RSASHA256Algorithm;
}
