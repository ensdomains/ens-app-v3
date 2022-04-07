import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { NameWrapper, NameWrapperInterface } from "../NameWrapper";
export declare class NameWrapper__factory {
    static readonly abi: ({
        type: string;
        payable: boolean;
        inputs: {
            type: string;
            name: string;
        }[];
        name?: undefined;
        anonymous?: undefined;
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
        anonymous?: undefined;
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
        }[];
        outputs: {
            type: string;
        }[];
        anonymous?: undefined;
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
    } | {
        type: string;
        name: string;
        constant: boolean;
        payable: boolean;
        inputs: ({
            type: string;
            name: string;
        } | {
            type: string;
            name?: undefined;
        })[];
        outputs: {
            type: string;
        }[];
        anonymous?: undefined;
        stateMutability?: undefined;
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
    })[];
    static createInterface(): NameWrapperInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NameWrapper;
}
