import type { FunctionFragment, Result } from '@ethersproject/abi';
import { Interface } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { BaseContract, CallOverrides, ContractTransaction, PayableOverrides, PopulatedTransaction } from '@ethersproject/contracts';
import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from './common';
export interface BulkRenewalInterface extends Interface {
    functions: {
        'ens()': FunctionFragment;
        'renewAll(string[],uint256)': FunctionFragment;
        'rentPrice(string[],uint256)': FunctionFragment;
        'supportsInterface(bytes4)': FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: 'ens' | 'renewAll' | 'rentPrice' | 'supportsInterface'): FunctionFragment;
    encodeFunctionData(functionFragment: 'ens', values?: undefined): string;
    encodeFunctionData(functionFragment: 'renewAll', values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'rentPrice', values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: 'ens', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'renewAll', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'rentPrice', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    events: {};
}
export interface BulkRenewal extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: BulkRenewalInterface;
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
        ens(overrides?: CallOverrides): Promise<[string]>;
        renewAll(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        rentPrice(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber] & {
            total: BigNumber;
        }>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    ens(overrides?: CallOverrides): Promise<string>;
    renewAll(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    rentPrice(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        ens(overrides?: CallOverrides): Promise<string>;
        renewAll(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        rentPrice(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        ens(overrides?: CallOverrides): Promise<BigNumber>;
        renewAll(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        rentPrice(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        ens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renewAll(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: PayableOverrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        rentPrice(names: PromiseOrValue<string>[], duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
