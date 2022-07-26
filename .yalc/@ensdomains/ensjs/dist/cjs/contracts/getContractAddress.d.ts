import { ContractName, SupportedNetworkId } from './types';
export declare type ContractAddressFetch = (contractName: ContractName) => string;
export declare const getContractAddress: (networkId: SupportedNetworkId) => ContractAddressFetch;
