import { ethers } from 'ethers';
export default class ContractManager {
    private provider;
    constructor(provider: ethers.providers.Provider);
    private generateContractGetter;
    getPublicResolver: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getUniversalResolver: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getRegistry: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getReverseRegistrar: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getDNCOCURP: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getNameWrapper: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getBaseRegistrar: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
    getMulticall: (passedProvider?: any, address?: string | undefined) => Promise<ethers.Contract>;
}
