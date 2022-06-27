import { ethers } from 'ethers';
import { ContractAddressFetch } from './getContractAddress';
export default class ContractManager {
    private provider;
    private fetchAddress;
    constructor(provider: ethers.providers.Provider, fetchAddress: ContractAddressFetch);
    private generateContractGetter;
    getPublicResolver: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated").PublicResolver>;
    getUniversalResolver: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated").UniversalResolver>;
    getRegistry: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated/ENSRegistry").ENSRegistry>;
    getReverseRegistrar: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated").ReverseRegistrar>;
    getNameWrapper: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated").NameWrapper>;
    getBaseRegistrar: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated/BaseRegistrarImplementation").BaseRegistrarImplementation>;
    getEthRegistrarController: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated").ETHRegistrarController>;
    getMulticall: (passedProvider?: any, address?: string | undefined) => Promise<import("../generated/Multicall").Multicall>;
}
