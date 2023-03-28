import type { EventFragment, FunctionFragment, Result } from '@ethersproject/abi';
import { Interface } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { BaseContract, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction } from '@ethersproject/contracts';
import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from './common';
export interface UniversalResolverInterface extends Interface {
    functions: {
        '_resolveSingle(bytes,bytes,string[],bytes4,bytes)': FunctionFragment;
        'batchGatewayURLs(uint256)': FunctionFragment;
        'findResolver(bytes)': FunctionFragment;
        'owner()': FunctionFragment;
        'registry()': FunctionFragment;
        'renounceOwnership()': FunctionFragment;
        'resolve(bytes,bytes,string[])': FunctionFragment;
        'resolve(bytes,bytes[])': FunctionFragment;
        'resolve(bytes,bytes[],string[])': FunctionFragment;
        'resolve(bytes,bytes)': FunctionFragment;
        'resolveCallback(bytes,bytes)': FunctionFragment;
        'resolveSingleCallback(bytes,bytes)': FunctionFragment;
        'reverse(bytes,string[])': FunctionFragment;
        'reverse(bytes)': FunctionFragment;
        'reverseCallback(bytes,bytes)': FunctionFragment;
        'setGatewayURLs(string[])': FunctionFragment;
        'supportsInterface(bytes4)': FunctionFragment;
        'transferOwnership(address)': FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: '_resolveSingle' | 'batchGatewayURLs' | 'findResolver' | 'owner' | 'registry' | 'renounceOwnership' | 'resolve(bytes,bytes,string[])' | 'resolve(bytes,bytes[])' | 'resolve(bytes,bytes[],string[])' | 'resolve(bytes,bytes)' | 'resolveCallback' | 'resolveSingleCallback' | 'reverse(bytes,string[])' | 'reverse(bytes)' | 'reverseCallback' | 'setGatewayURLs' | 'supportsInterface' | 'transferOwnership'): FunctionFragment;
    encodeFunctionData(functionFragment: '_resolveSingle', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>[],
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'batchGatewayURLs', values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'findResolver', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
    encodeFunctionData(functionFragment: 'registry', values?: undefined): string;
    encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
    encodeFunctionData(functionFragment: 'resolve(bytes,bytes,string[])', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>[]
    ]): string;
    encodeFunctionData(functionFragment: 'resolve(bytes,bytes[])', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>[]]): string;
    encodeFunctionData(functionFragment: 'resolve(bytes,bytes[],string[])', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>[],
        PromiseOrValue<string>[]
    ]): string;
    encodeFunctionData(functionFragment: 'resolve(bytes,bytes)', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'resolveCallback', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'resolveSingleCallback', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'reverse(bytes,string[])', values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: 'reverse(bytes)', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'reverseCallback', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'setGatewayURLs', values: [PromiseOrValue<string>[]]): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
    decodeFunctionResult(functionFragment: '_resolveSingle', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'batchGatewayURLs', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'findResolver', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'registry', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'resolve(bytes,bytes,string[])', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'resolve(bytes,bytes[])', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'resolve(bytes,bytes[],string[])', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'resolve(bytes,bytes)', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'resolveCallback', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'resolveSingleCallback', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reverse(bytes,string[])', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reverse(bytes)', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'reverseCallback', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setGatewayURLs', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
    events: {
        'OwnershipTransferred(address,address)': EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
}
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export declare type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface UniversalResolver extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: UniversalResolverInterface;
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
        _resolveSingle(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], callbackFunction: PromiseOrValue<BytesLike>, metaData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        batchGatewayURLs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        findResolver(name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        registry(overrides?: CallOverrides): Promise<[string]>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        'resolve(bytes,bytes,string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string, string]>;
        'resolve(bytes,bytes[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<[string[], string]>;
        'resolve(bytes,bytes[],string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string[], string]>;
        'resolve(bytes,bytes)'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        resolveCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string[], string]>;
        resolveSingleCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        'reverse(bytes,string[])'(reverseName: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string, string, string, string]>;
        'reverse(bytes)'(reverseName: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string, string, string]>;
        reverseCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string, string, string]>;
        setGatewayURLs(_urls: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    _resolveSingle(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], callbackFunction: PromiseOrValue<BytesLike>, metaData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
    batchGatewayURLs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    findResolver(name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
    owner(overrides?: CallOverrides): Promise<string>;
    registry(overrides?: CallOverrides): Promise<string>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    'resolve(bytes,bytes,string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string, string]>;
    'resolve(bytes,bytes[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<[string[], string]>;
    'resolve(bytes,bytes[],string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string[], string]>;
    'resolve(bytes,bytes)'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
    resolveCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string[], string]>;
    resolveSingleCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
    'reverse(bytes,string[])'(reverseName: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string, string, string, string]>;
    'reverse(bytes)'(reverseName: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string, string, string]>;
    reverseCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string, string, string]>;
    setGatewayURLs(_urls: PromiseOrValue<string>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        _resolveSingle(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], callbackFunction: PromiseOrValue<BytesLike>, metaData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        batchGatewayURLs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        findResolver(name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        owner(overrides?: CallOverrides): Promise<string>;
        registry(overrides?: CallOverrides): Promise<string>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        'resolve(bytes,bytes,string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string, string]>;
        'resolve(bytes,bytes[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<[string[], string]>;
        'resolve(bytes,bytes[],string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string[], string]>;
        'resolve(bytes,bytes)'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        resolveCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string[], string]>;
        resolveSingleCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string]>;
        'reverse(bytes,string[])'(reverseName: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<[string, string, string, string]>;
        'reverse(bytes)'(reverseName: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string, string, string]>;
        reverseCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string, string, string]>;
        setGatewayURLs(_urls: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<void>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        'OwnershipTransferred(address,address)'(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
    };
    estimateGas: {
        _resolveSingle(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], callbackFunction: PromiseOrValue<BytesLike>, metaData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        batchGatewayURLs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        findResolver(name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        registry(overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        'resolve(bytes,bytes,string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<BigNumber>;
        'resolve(bytes,bytes[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<BigNumber>;
        'resolve(bytes,bytes[],string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<BigNumber>;
        'resolve(bytes,bytes)'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        resolveCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        resolveSingleCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        'reverse(bytes,string[])'(reverseName: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<BigNumber>;
        'reverse(bytes)'(reverseName: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        reverseCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        setGatewayURLs(_urls: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        _resolveSingle(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], callbackFunction: PromiseOrValue<BytesLike>, metaData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        batchGatewayURLs(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        findResolver(name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        registry(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        'resolve(bytes,bytes,string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'resolve(bytes,bytes[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'resolve(bytes,bytes[],string[])'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'resolve(bytes,bytes)'(name: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        resolveCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        resolveSingleCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'reverse(bytes,string[])'(reverseName: PromiseOrValue<BytesLike>, gateways: PromiseOrValue<string>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'reverse(bytes)'(reverseName: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        reverseCallback(response: PromiseOrValue<BytesLike>, extraData: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setGatewayURLs(_urls: PromiseOrValue<string>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
