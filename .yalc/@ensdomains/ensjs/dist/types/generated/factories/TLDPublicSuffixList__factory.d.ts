import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { TLDPublicSuffixList, TLDPublicSuffixListInterface } from "../TLDPublicSuffixList";
export declare class TLDPublicSuffixList__factory {
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
    static createInterface(): TLDPublicSuffixListInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): TLDPublicSuffixList;
}
