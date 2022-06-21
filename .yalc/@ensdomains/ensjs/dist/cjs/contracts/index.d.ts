import { ethers } from 'ethers';
import type { BaseRegistrarImplementation } from '../generated/BaseRegistrarImplementation';
import type { ENSRegistry } from '../generated/ENSRegistry';
import type { Multicall } from '../generated/Multicall';
import type { NameWrapper } from '../generated/NameWrapper';
import type { PublicResolver } from '../generated/PublicResolver';
import type { ReverseRegistrar } from '../generated/ReverseRegistrar';
import type { UniversalResolver } from '../generated/UniversalResolver';
import { ContractAddressFetch } from './getContractAddress';
export default class ContractManager {
    private provider;
    private fetchAddress;
    constructor(provider: ethers.providers.Provider, fetchAddress: ContractAddressFetch);
    private generateContractGetter;
    getPublicResolver: (passedProvider?: any, address?: string | undefined) => Promise<PublicResolver>;
    getUniversalResolver: (passedProvider?: any, address?: string | undefined) => Promise<UniversalResolver>;
    getRegistry: (passedProvider?: any, address?: string | undefined) => Promise<ENSRegistry>;
    getReverseRegistrar: (passedProvider?: any, address?: string | undefined) => Promise<ReverseRegistrar>;
    getNameWrapper: (passedProvider?: any, address?: string | undefined) => Promise<NameWrapper>;
    getBaseRegistrar: (passedProvider?: any, address?: string | undefined) => Promise<BaseRegistrarImplementation>;
    getMulticall: (passedProvider?: any, address?: string | undefined) => Promise<Multicall>;
}
