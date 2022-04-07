import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { PublicResolver, PublicResolverInterface } from "../PublicResolver";
export declare class PublicResolver__factory {
    static readonly abi: ({
        type: string;
        payable: boolean;
        inputs: {
            type: string;
            name: string;
        }[];
        anonymous?: undefined;
        name?: undefined;
        constant?: undefined;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        type: string;
        anonymous: boolean;
        name: string;
        inputs: {
            type: string;
            name: string;
            indexed: boolean;
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
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        constant: boolean;
        payable: boolean;
        inputs: {
            type: string;
            name: string;
        }[];
        outputs: {
            type: string;
            name: string;
        }[];
        anonymous?: undefined;
        stateMutability?: undefined;
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
            name: string;
        }[];
        anonymous?: undefined;
    })[];
    static createInterface(): PublicResolverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): PublicResolver;
}
