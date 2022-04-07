import { Signer } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { StaticMetadataService, StaticMetadataServiceInterface } from "../StaticMetadataService";
export declare class StaticMetadataService__factory {
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
        constant: boolean;
        stateMutability: string;
        payable: boolean;
        inputs: {
            type: string;
        }[];
        outputs: {
            type: string;
        }[];
    })[];
    static createInterface(): StaticMetadataServiceInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): StaticMetadataService;
}
