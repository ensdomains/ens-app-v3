import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { DoNotCallOnChainUniversalResolverProxy, DoNotCallOnChainUniversalResolverProxyInterface } from "../DoNotCallOnChainUniversalResolverProxy";
export declare class DoNotCallOnChainUniversalResolverProxy__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        inputs: ({
            internalType: string;
            name: string;
            type: string;
            components?: undefined;
        } | {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        })[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): DoNotCallOnChainUniversalResolverProxyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DoNotCallOnChainUniversalResolverProxy;
}
