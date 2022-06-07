import type { BaseContract, BigNumber, BytesLike, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";
export interface RootInterface extends utils.Interface {
    functions: {
        "controllers(address)": FunctionFragment;
        "ens()": FunctionFragment;
        "isOwner(address)": FunctionFragment;
        "lock(bytes32)": FunctionFragment;
        "locked(bytes32)": FunctionFragment;
        "owner()": FunctionFragment;
        "setController(address,bool)": FunctionFragment;
        "setResolver(address)": FunctionFragment;
        "setSubnodeOwner(bytes32,address)": FunctionFragment;
        "supportsInterface(bytes4)": FunctionFragment;
        "transferOwnership(address)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "controllers" | "ens" | "isOwner" | "lock" | "locked" | "owner" | "setController" | "setResolver" | "setSubnodeOwner" | "supportsInterface" | "transferOwnership"): FunctionFragment;
    encodeFunctionData(functionFragment: "controllers", values: [string]): string;
    encodeFunctionData(functionFragment: "ens", values?: undefined): string;
    encodeFunctionData(functionFragment: "isOwner", values: [string]): string;
    encodeFunctionData(functionFragment: "lock", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "locked", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "setController", values: [string, boolean]): string;
    encodeFunctionData(functionFragment: "setResolver", values: [string]): string;
    encodeFunctionData(functionFragment: "setSubnodeOwner", values: [BytesLike, string]): string;
    encodeFunctionData(functionFragment: "supportsInterface", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [string]): string;
    decodeFunctionResult(functionFragment: "controllers", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "ens", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "lock", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "locked", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setController", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setResolver", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setSubnodeOwner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "supportsInterface", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    events: {
        "TLDLocked(bytes32)": EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: "TLDLocked"): EventFragment;
}
export interface TLDLockedEventObject {
    label: string;
}
export declare type TLDLockedEvent = TypedEvent<[string], TLDLockedEventObject>;
export declare type TLDLockedEventFilter = TypedEventFilter<TLDLockedEvent>;
export interface Root extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: RootInterface;
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
        controllers(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
        ens(overrides?: CallOverrides): Promise<[string]>;
        isOwner(addr: string, overrides?: CallOverrides): Promise<[boolean]>;
        lock(label: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        locked(arg0: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        setController(controller: string, enabled: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        setResolver(resolver: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        setSubnodeOwner(label: BytesLike, owner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
        supportsInterface(interfaceID: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
        transferOwnership(newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<ContractTransaction>;
    };
    controllers(arg0: string, overrides?: CallOverrides): Promise<boolean>;
    ens(overrides?: CallOverrides): Promise<string>;
    isOwner(addr: string, overrides?: CallOverrides): Promise<boolean>;
    lock(label: BytesLike, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    locked(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;
    owner(overrides?: CallOverrides): Promise<string>;
    setController(controller: string, enabled: boolean, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    setResolver(resolver: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    setSubnodeOwner(label: BytesLike, owner: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(interfaceID: BytesLike, overrides?: CallOverrides): Promise<boolean>;
    transferOwnership(newOwner: string, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        controllers(arg0: string, overrides?: CallOverrides): Promise<boolean>;
        ens(overrides?: CallOverrides): Promise<string>;
        isOwner(addr: string, overrides?: CallOverrides): Promise<boolean>;
        lock(label: BytesLike, overrides?: CallOverrides): Promise<void>;
        locked(arg0: BytesLike, overrides?: CallOverrides): Promise<boolean>;
        owner(overrides?: CallOverrides): Promise<string>;
        setController(controller: string, enabled: boolean, overrides?: CallOverrides): Promise<void>;
        setResolver(resolver: string, overrides?: CallOverrides): Promise<void>;
        setSubnodeOwner(label: BytesLike, owner: string, overrides?: CallOverrides): Promise<void>;
        supportsInterface(interfaceID: BytesLike, overrides?: CallOverrides): Promise<boolean>;
        transferOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        "TLDLocked(bytes32)"(label?: BytesLike | null): TLDLockedEventFilter;
        TLDLocked(label?: BytesLike | null): TLDLockedEventFilter;
    };
    estimateGas: {
        controllers(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
        ens(overrides?: CallOverrides): Promise<BigNumber>;
        isOwner(addr: string, overrides?: CallOverrides): Promise<BigNumber>;
        lock(label: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        locked(arg0: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        setController(controller: string, enabled: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        setResolver(resolver: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        setSubnodeOwner(label: BytesLike, owner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
        supportsInterface(interfaceID: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        controllers(arg0: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isOwner(addr: string, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        lock(label: BytesLike, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        locked(arg0: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setController(controller: string, enabled: boolean, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        setResolver(resolver: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        setSubnodeOwner(label: BytesLike, owner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: BytesLike, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: string, overrides?: Overrides & {
            from?: string | Promise<string>;
        }): Promise<PopulatedTransaction>;
    };
}
