import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface ReverseRegistrarInterface extends utils.Interface {
    functions: {
        "ADDR_REVERSE_NODE()": FunctionFragment;
        "claim(address)": FunctionFragment;
        "claimWithResolver(address,address)": FunctionFragment;
        "defaultResolver()": FunctionFragment;
        "ens()": FunctionFragment;
        "node(address)": FunctionFragment;
        "setName(string)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "ADDR_REVERSE_NODE" | "claim" | "claimWithResolver" | "defaultResolver" | "ens" | "node" | "setName"): FunctionFragment;
    encodeFunctionData(functionFragment: "ADDR_REVERSE_NODE", values?: undefined): string;
    encodeFunctionData(functionFragment: "claim", values: [string]): string;
    encodeFunctionData(functionFragment: "claimWithResolver", values: [string, string]): string;
    encodeFunctionData(functionFragment: "defaultResolver", values?: undefined): string;
    encodeFunctionData(functionFragment: "ens", values?: undefined): string;
    encodeFunctionData(functionFragment: "node", values: [string]): string;
    encodeFunctionData(functionFragment: "setName", values: [string]): string;
    decodeFunctionResult(functionFragment: "ADDR_REVERSE_NODE", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claim", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "claimWithResolver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "defaultResolver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "node", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setName", data: BytesLike): Result;
    events: {};
}
export interface ReverseRegistrar extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: ReverseRegistrarInterface;
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
        ADDR_REVERSE_NODE(overrides?: CallOverrides): Promise<[string]>;
        claim(owner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        claimWithResolver(owner: string, resolver: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        defaultResolver(overrides?: CallOverrides): Promise<[string]>;
        ens(overrides?: CallOverrides): Promise<[string]>;
        node(addr: string, overrides?: CallOverrides): Promise<[string]>;
        setName(name: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    ADDR_REVERSE_NODE(overrides?: CallOverrides): Promise<string>;
    claim(owner: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    claimWithResolver(owner: string, resolver: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    defaultResolver(overrides?: CallOverrides): Promise<string>;
    ens(overrides?: CallOverrides): Promise<string>;
    node(addr: string, overrides?: CallOverrides): Promise<string>;
    setName(name: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        ADDR_REVERSE_NODE(overrides?: CallOverrides): Promise<string>;
        claim(owner: string, overrides?: CallOverrides): Promise<string>;
        claimWithResolver(owner: string, resolver: string, overrides?: CallOverrides): Promise<string>;
        defaultResolver(overrides?: CallOverrides): Promise<string>;
        ens(overrides?: CallOverrides): Promise<string>;
        node(addr: string, overrides?: CallOverrides): Promise<string>;
        setName(name: string, overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        ADDR_REVERSE_NODE(overrides?: CallOverrides): Promise<BigNumber>;
        claim(owner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        claimWithResolver(owner: string, resolver: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        defaultResolver(overrides?: CallOverrides): Promise<BigNumber>;
        ens(overrides?: CallOverrides): Promise<BigNumber>;
        node(addr: string, overrides?: CallOverrides): Promise<BigNumber>;
        setName(name: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        ADDR_REVERSE_NODE(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        claim(owner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        claimWithResolver(owner: string, resolver: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        defaultResolver(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        node(addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setName(name: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
