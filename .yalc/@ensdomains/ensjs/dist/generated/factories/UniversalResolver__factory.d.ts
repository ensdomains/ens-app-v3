import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { UniversalResolver, UniversalResolverInterface } from "../UniversalResolver";
export declare class UniversalResolver__factory {
    static readonly abi: ({
        type: string;
        payable: boolean;
        inputs: {
            type: string;
            name: string;
        }[];
        name?: undefined;
        constant?: undefined;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            type: string;
            name: string;
        }[];
        payable?: undefined;
        constant?: undefined;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        type: string;
        name: string;
        constant: boolean;
        stateMutability: string;
        payable: boolean;
        inputs: {
            type: string;
            name: string;
        }[];
        outputs: {
            type: string;
        }[];
    })[];
    static createInterface(): UniversalResolverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): UniversalResolver;
}
