import { ethers } from 'ethers';
import { ContractAddressFetch } from './getContractAddress';
export default class ContractManager {
    private provider;
    private fetchAddress;
    constructor(provider: ethers.providers.Provider, fetchAddress: ContractAddressFetch);
    private generateContractGetter;
    getPublicResolver: (passedProvider?: any, address?: string) => Promise<import("../generated").PublicResolver>;
    getUniversalResolver: (passedProvider?: any, address?: string) => Promise<import("../generated").UniversalResolver>;
    getRegistry: (passedProvider?: any, address?: string) => Promise<import("../generated").ENSRegistry>;
    getReverseRegistrar: (passedProvider?: any, address?: string) => Promise<import("../generated").ReverseRegistrar>;
    getNameWrapper: (passedProvider?: any, address?: string) => Promise<import("../generated").NameWrapper>;
    getBaseRegistrar: (passedProvider?: any, address?: string) => Promise<import("../generated").BaseRegistrarImplementation>;
    getEthRegistrarController: (passedProvider?: any, address?: string) => Promise<import("../generated").ETHRegistrarController>;
    getMulticall: (passedProvider?: any, address?: string) => Promise<import("../generated").Multicall>;
}
