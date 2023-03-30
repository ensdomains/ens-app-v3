import type { EventFragment, FunctionFragment, Result } from '@ethersproject/abi';
import { Interface } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { BaseContract, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction } from '@ethersproject/contracts';
import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from './common';
export declare namespace DNSSEC {
    type RRSetWithSignatureStruct = {
        rrset: PromiseOrValue<BytesLike>;
        sig: PromiseOrValue<BytesLike>;
    };
    type RRSetWithSignatureStructOutput = [string, string] & {
        rrset: string;
        sig: string;
    };
}
export interface DNSRegistrarInterface extends Interface {
    functions: {
        'claim(bytes,bytes)': FunctionFragment;
        'ens()': FunctionFragment;
        'oracle()': FunctionFragment;
        'proveAndClaim(bytes,(bytes,bytes)[],bytes)': FunctionFragment;
        'proveAndClaimWithResolver(bytes,(bytes,bytes)[],bytes,address,address)': FunctionFragment;
        'setOracle(address)': FunctionFragment;
        'setPublicSuffixList(address)': FunctionFragment;
        'suffixes()': FunctionFragment;
        'supportsInterface(bytes4)': FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: 'claim' | 'ens' | 'oracle' | 'proveAndClaim' | 'proveAndClaimWithResolver' | 'setOracle' | 'setPublicSuffixList' | 'suffixes' | 'supportsInterface'): FunctionFragment;
    encodeFunctionData(functionFragment: 'claim', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'ens', values?: undefined): string;
    encodeFunctionData(functionFragment: 'oracle', values?: undefined): string;
    encodeFunctionData(functionFragment: 'proveAndClaim', values: [
        PromiseOrValue<BytesLike>,
        DNSSEC.RRSetWithSignatureStruct[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'proveAndClaimWithResolver', values: [
        PromiseOrValue<BytesLike>,
        DNSSEC.RRSetWithSignatureStruct[],
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'setOracle', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'setPublicSuffixList', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'suffixes', values?: undefined): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'ens', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'oracle', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'proveAndClaim', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'proveAndClaimWithResolver', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setOracle', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setPublicSuffixList', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'suffixes', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    events: {
        'Claim(bytes32,address,bytes)': EventFragment;
        'NewOracle(address)': EventFragment;
        'NewPublicSuffixList(address)': EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: 'Claim'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'NewOracle'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'NewPublicSuffixList'): EventFragment;
}
export interface ClaimEventObject {
    node: string;
    owner: string;
    dnsname: string;
}
export declare type ClaimEvent = TypedEvent<[string, string, string], ClaimEventObject>;
export declare type ClaimEventFilter = TypedEventFilter<ClaimEvent>;
export interface NewOracleEventObject {
    oracle: string;
}
export declare type NewOracleEvent = TypedEvent<[string], NewOracleEventObject>;
export declare type NewOracleEventFilter = TypedEventFilter<NewOracleEvent>;
export interface NewPublicSuffixListEventObject {
    suffixes: string;
}
export declare type NewPublicSuffixListEvent = TypedEvent<[
    string
], NewPublicSuffixListEventObject>;
export declare type NewPublicSuffixListEventFilter = TypedEventFilter<NewPublicSuffixListEvent>;
export interface DNSRegistrar extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: DNSRegistrarInterface;
    queryFilter<TEvent extends TypedEvent>(event: TypedEventFilter<TEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TEvent>>;
    listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>;
    listeners(eventName?: string): Array<Listener>;
    removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this;
    removeAllListeners(eventName?: string): this;
    off: OnEvent<this>;
    on: OnEvent<this>;
    once: OnEvent<this>;
    removeListener: OnEvent<this>;
    functions: {
        /**
         * Claims a name by proving ownership of its DNS equivalent.
         * @param name The name to claim, in DNS wire format.
         * @param proof A DNS RRSet proving ownership of the name. Must be verified        in the DNSSEC oracle before calling. This RRSET must contain a TXT        record for '_ens.' + name, with the value 'a=0x...'. Ownership of        the name will be transferred to the address specified in the TXT        record.
         */
        claim(name: PromiseOrValue<BytesLike>, proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        ens(overrides?: CallOverrides): Promise<[string]>;
        oracle(overrides?: CallOverrides): Promise<[string]>;
        proveAndClaim(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        proveAndClaimWithResolver(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setOracle(_dnssec: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPublicSuffixList(_suffixes: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        suffixes(overrides?: CallOverrides): Promise<[string]>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    /**
     * Claims a name by proving ownership of its DNS equivalent.
     * @param name The name to claim, in DNS wire format.
     * @param proof A DNS RRSet proving ownership of the name. Must be verified        in the DNSSEC oracle before calling. This RRSET must contain a TXT        record for '_ens.' + name, with the value 'a=0x...'. Ownership of        the name will be transferred to the address specified in the TXT        record.
     */
    claim(name: PromiseOrValue<BytesLike>, proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    ens(overrides?: CallOverrides): Promise<string>;
    oracle(overrides?: CallOverrides): Promise<string>;
    proveAndClaim(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    proveAndClaimWithResolver(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, addr: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setOracle(_dnssec: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPublicSuffixList(_suffixes: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    suffixes(overrides?: CallOverrides): Promise<string>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        /**
         * Claims a name by proving ownership of its DNS equivalent.
         * @param name The name to claim, in DNS wire format.
         * @param proof A DNS RRSet proving ownership of the name. Must be verified        in the DNSSEC oracle before calling. This RRSET must contain a TXT        record for '_ens.' + name, with the value 'a=0x...'. Ownership of        the name will be transferred to the address specified in the TXT        record.
         */
        claim(name: PromiseOrValue<BytesLike>, proof: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        ens(overrides?: CallOverrides): Promise<string>;
        oracle(overrides?: CallOverrides): Promise<string>;
        proveAndClaim(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        proveAndClaimWithResolver(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setOracle(_dnssec: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPublicSuffixList(_suffixes: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        suffixes(overrides?: CallOverrides): Promise<string>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {
        'Claim(bytes32,address,bytes)'(node?: PromiseOrValue<BytesLike> | null, owner?: PromiseOrValue<string> | null, dnsname?: null): ClaimEventFilter;
        Claim(node?: PromiseOrValue<BytesLike> | null, owner?: PromiseOrValue<string> | null, dnsname?: null): ClaimEventFilter;
        'NewOracle(address)'(oracle?: null): NewOracleEventFilter;
        NewOracle(oracle?: null): NewOracleEventFilter;
        'NewPublicSuffixList(address)'(suffixes?: null): NewPublicSuffixListEventFilter;
        NewPublicSuffixList(suffixes?: null): NewPublicSuffixListEventFilter;
    };
    estimateGas: {
        /**
         * Claims a name by proving ownership of its DNS equivalent.
         * @param name The name to claim, in DNS wire format.
         * @param proof A DNS RRSet proving ownership of the name. Must be verified        in the DNSSEC oracle before calling. This RRSET must contain a TXT        record for '_ens.' + name, with the value 'a=0x...'. Ownership of        the name will be transferred to the address specified in the TXT        record.
         */
        claim(name: PromiseOrValue<BytesLike>, proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        ens(overrides?: CallOverrides): Promise<BigNumber>;
        oracle(overrides?: CallOverrides): Promise<BigNumber>;
        proveAndClaim(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        proveAndClaimWithResolver(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setOracle(_dnssec: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPublicSuffixList(_suffixes: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        suffixes(overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        /**
         * Claims a name by proving ownership of its DNS equivalent.
         * @param name The name to claim, in DNS wire format.
         * @param proof A DNS RRSet proving ownership of the name. Must be verified        in the DNSSEC oracle before calling. This RRSET must contain a TXT        record for '_ens.' + name, with the value 'a=0x...'. Ownership of        the name will be transferred to the address specified in the TXT        record.
         */
        claim(name: PromiseOrValue<BytesLike>, proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        ens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        proveAndClaim(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        proveAndClaimWithResolver(name: PromiseOrValue<BytesLike>, input: DNSSEC.RRSetWithSignatureStruct[], proof: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, addr: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setOracle(_dnssec: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPublicSuffixList(_suffixes: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        suffixes(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
