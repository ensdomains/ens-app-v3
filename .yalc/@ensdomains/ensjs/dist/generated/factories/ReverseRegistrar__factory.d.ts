import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ReverseRegistrar, ReverseRegistrarInterface } from "../ReverseRegistrar";
export declare class ReverseRegistrar__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
        constant?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        constant: boolean;
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
        payable: boolean;
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): ReverseRegistrarInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ReverseRegistrar;
}
