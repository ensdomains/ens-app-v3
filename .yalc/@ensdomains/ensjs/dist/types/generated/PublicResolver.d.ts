import type { EventFragment, FunctionFragment, Result } from '@ethersproject/abi';
import { Interface } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { BaseContract, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction } from '@ethersproject/contracts';
import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from './common';
export interface PublicResolverInterface extends Interface {
    functions: {
        'ABI(bytes32,uint256)': FunctionFragment;
        'addr(bytes32)': FunctionFragment;
        'addr(bytes32,uint256)': FunctionFragment;
        'approve(bytes32,address,bool)': FunctionFragment;
        'clearRecords(bytes32)': FunctionFragment;
        'contenthash(bytes32)': FunctionFragment;
        'dnsRecord(bytes32,bytes32,uint16)': FunctionFragment;
        'hasDNSRecords(bytes32,bytes32)': FunctionFragment;
        'interfaceImplementer(bytes32,bytes4)': FunctionFragment;
        'isApprovedFor(address,bytes32,address)': FunctionFragment;
        'isApprovedForAll(address,address)': FunctionFragment;
        'multicall(bytes[])': FunctionFragment;
        'multicallWithNodeCheck(bytes32,bytes[])': FunctionFragment;
        'name(bytes32)': FunctionFragment;
        'pubkey(bytes32)': FunctionFragment;
        'recordVersions(bytes32)': FunctionFragment;
        'setABI(bytes32,uint256,bytes)': FunctionFragment;
        'setAddr(bytes32,uint256,bytes)': FunctionFragment;
        'setAddr(bytes32,address)': FunctionFragment;
        'setApprovalForAll(address,bool)': FunctionFragment;
        'setContenthash(bytes32,bytes)': FunctionFragment;
        'setDNSRecords(bytes32,bytes)': FunctionFragment;
        'setInterface(bytes32,bytes4,address)': FunctionFragment;
        'setName(bytes32,string)': FunctionFragment;
        'setPubkey(bytes32,bytes32,bytes32)': FunctionFragment;
        'setText(bytes32,string,string)': FunctionFragment;
        'setZonehash(bytes32,bytes)': FunctionFragment;
        'supportsInterface(bytes4)': FunctionFragment;
        'text(bytes32,string)': FunctionFragment;
        'zonehash(bytes32)': FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: 'ABI' | 'addr(bytes32)' | 'addr(bytes32,uint256)' | 'approve' | 'clearRecords' | 'contenthash' | 'dnsRecord' | 'hasDNSRecords' | 'interfaceImplementer' | 'isApprovedFor' | 'isApprovedForAll' | 'multicall' | 'multicallWithNodeCheck' | 'name' | 'pubkey' | 'recordVersions' | 'setABI' | 'setAddr(bytes32,uint256,bytes)' | 'setAddr(bytes32,address)' | 'setApprovalForAll' | 'setContenthash' | 'setDNSRecords' | 'setInterface' | 'setName' | 'setPubkey' | 'setText' | 'setZonehash' | 'supportsInterface' | 'text' | 'zonehash'): FunctionFragment;
    encodeFunctionData(functionFragment: 'ABI', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'addr(bytes32)', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'addr(bytes32,uint256)', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'approve', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<boolean>
    ]): string;
    encodeFunctionData(functionFragment: 'clearRecords', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'contenthash', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'dnsRecord', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'hasDNSRecords', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'interfaceImplementer', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'isApprovedFor', values: [
        PromiseOrValue<string>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'isApprovedForAll', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'multicall', values: [PromiseOrValue<BytesLike>[]]): string;
    encodeFunctionData(functionFragment: 'multicallWithNodeCheck', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>[]]): string;
    encodeFunctionData(functionFragment: 'name', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'pubkey', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'recordVersions', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'setABI', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'setAddr(bytes32,uint256,bytes)', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'setAddr(bytes32,address)', values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'setApprovalForAll', values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: 'setContenthash', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'setDNSRecords', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'setInterface', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'setName', values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'setPubkey', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'setText', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'setZonehash', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'text', values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'zonehash', values: [PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: 'ABI', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'addr(bytes32)', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'addr(bytes32,uint256)', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'approve', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'clearRecords', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'contenthash', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'dnsRecord', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'hasDNSRecords', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'interfaceImplementer', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'isApprovedFor', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'isApprovedForAll', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'multicall', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'multicallWithNodeCheck', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'pubkey', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'recordVersions', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setABI', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setAddr(bytes32,uint256,bytes)', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setAddr(bytes32,address)', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setApprovalForAll', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setContenthash', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setDNSRecords', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setInterface', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setName', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setPubkey', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setText', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setZonehash', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'text', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'zonehash', data: BytesLike): Result;
    events: {
        'ABIChanged(bytes32,uint256)': EventFragment;
        'AddrChanged(bytes32,address)': EventFragment;
        'AddressChanged(bytes32,uint256,bytes)': EventFragment;
        'ApprovalForAll(address,address,bool)': EventFragment;
        'Approved(address,bytes32,address,bool)': EventFragment;
        'ContenthashChanged(bytes32,bytes)': EventFragment;
        'DNSRecordChanged(bytes32,bytes,uint16,bytes)': EventFragment;
        'DNSRecordDeleted(bytes32,bytes,uint16)': EventFragment;
        'DNSZonehashChanged(bytes32,bytes,bytes)': EventFragment;
        'InterfaceChanged(bytes32,bytes4,address)': EventFragment;
        'NameChanged(bytes32,string)': EventFragment;
        'PubkeyChanged(bytes32,bytes32,bytes32)': EventFragment;
        'TextChanged(bytes32,string,string,string)': EventFragment;
        'VersionChanged(bytes32,uint64)': EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: 'ABIChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'AddrChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'AddressChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'ApprovalForAll'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'Approved'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'ContenthashChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'DNSRecordChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'DNSRecordDeleted'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'DNSZonehashChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'InterfaceChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'NameChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'PubkeyChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'TextChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'VersionChanged'): EventFragment;
}
export interface ABIChangedEventObject {
    node: string;
    contentType: BigNumber;
}
export declare type ABIChangedEvent = TypedEvent<[
    string,
    BigNumber
], ABIChangedEventObject>;
export declare type ABIChangedEventFilter = TypedEventFilter<ABIChangedEvent>;
export interface AddrChangedEventObject {
    node: string;
    a: string;
}
export declare type AddrChangedEvent = TypedEvent<[
    string,
    string
], AddrChangedEventObject>;
export declare type AddrChangedEventFilter = TypedEventFilter<AddrChangedEvent>;
export interface AddressChangedEventObject {
    node: string;
    coinType: BigNumber;
    newAddress: string;
}
export declare type AddressChangedEvent = TypedEvent<[
    string,
    BigNumber,
    string
], AddressChangedEventObject>;
export declare type AddressChangedEventFilter = TypedEventFilter<AddressChangedEvent>;
export interface ApprovalForAllEventObject {
    owner: string;
    operator: string;
    approved: boolean;
}
export declare type ApprovalForAllEvent = TypedEvent<[
    string,
    string,
    boolean
], ApprovalForAllEventObject>;
export declare type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
export interface ApprovedEventObject {
    owner: string;
    node: string;
    delegate: string;
    approved: boolean;
}
export declare type ApprovedEvent = TypedEvent<[
    string,
    string,
    string,
    boolean
], ApprovedEventObject>;
export declare type ApprovedEventFilter = TypedEventFilter<ApprovedEvent>;
export interface ContenthashChangedEventObject {
    node: string;
    hash: string;
}
export declare type ContenthashChangedEvent = TypedEvent<[
    string,
    string
], ContenthashChangedEventObject>;
export declare type ContenthashChangedEventFilter = TypedEventFilter<ContenthashChangedEvent>;
export interface DNSRecordChangedEventObject {
    node: string;
    name: string;
    resource: number;
    record: string;
}
export declare type DNSRecordChangedEvent = TypedEvent<[
    string,
    string,
    number,
    string
], DNSRecordChangedEventObject>;
export declare type DNSRecordChangedEventFilter = TypedEventFilter<DNSRecordChangedEvent>;
export interface DNSRecordDeletedEventObject {
    node: string;
    name: string;
    resource: number;
}
export declare type DNSRecordDeletedEvent = TypedEvent<[
    string,
    string,
    number
], DNSRecordDeletedEventObject>;
export declare type DNSRecordDeletedEventFilter = TypedEventFilter<DNSRecordDeletedEvent>;
export interface DNSZonehashChangedEventObject {
    node: string;
    lastzonehash: string;
    zonehash: string;
}
export declare type DNSZonehashChangedEvent = TypedEvent<[
    string,
    string,
    string
], DNSZonehashChangedEventObject>;
export declare type DNSZonehashChangedEventFilter = TypedEventFilter<DNSZonehashChangedEvent>;
export interface InterfaceChangedEventObject {
    node: string;
    interfaceID: string;
    implementer: string;
}
export declare type InterfaceChangedEvent = TypedEvent<[
    string,
    string,
    string
], InterfaceChangedEventObject>;
export declare type InterfaceChangedEventFilter = TypedEventFilter<InterfaceChangedEvent>;
export interface NameChangedEventObject {
    node: string;
    name: string;
}
export declare type NameChangedEvent = TypedEvent<[
    string,
    string
], NameChangedEventObject>;
export declare type NameChangedEventFilter = TypedEventFilter<NameChangedEvent>;
export interface PubkeyChangedEventObject {
    node: string;
    x: string;
    y: string;
}
export declare type PubkeyChangedEvent = TypedEvent<[
    string,
    string,
    string
], PubkeyChangedEventObject>;
export declare type PubkeyChangedEventFilter = TypedEventFilter<PubkeyChangedEvent>;
export interface TextChangedEventObject {
    node: string;
    indexedKey: string;
    key: string;
    value: string;
}
export declare type TextChangedEvent = TypedEvent<[
    string,
    string,
    string,
    string
], TextChangedEventObject>;
export declare type TextChangedEventFilter = TypedEventFilter<TextChangedEvent>;
export interface VersionChangedEventObject {
    node: string;
    newVersion: BigNumber;
}
export declare type VersionChangedEvent = TypedEvent<[
    string,
    BigNumber
], VersionChangedEventObject>;
export declare type VersionChangedEventFilter = TypedEventFilter<VersionChangedEvent>;
export interface PublicResolver extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: PublicResolverInterface;
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
        ABI(node: PromiseOrValue<BytesLike>, contentTypes: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber, string]>;
        'addr(bytes32)'(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        'addr(bytes32,uint256)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        approve(node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        clearRecords(node: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        contenthash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        dnsRecord(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, resource: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        hasDNSRecords(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        interfaceImplementer(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        isApprovedFor(owner: PromiseOrValue<string>, node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        multicall(data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        multicallWithNodeCheck(nodehash: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        name(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        pubkey(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string] & {
            x: string;
            y: string;
        }>;
        recordVersions(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[BigNumber]>;
        setABI(node: PromiseOrValue<BytesLike>, contentType: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        'setAddr(bytes32,uint256,bytes)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, a: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        'setAddr(bytes32,address)'(node: PromiseOrValue<BytesLike>, a: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setContenthash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setDNSRecords(node: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setInterface(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, implementer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setName(node: PromiseOrValue<BytesLike>, newName: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setPubkey(node: PromiseOrValue<BytesLike>, x: PromiseOrValue<BytesLike>, y: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setText(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, value: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setZonehash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        text(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[string]>;
        zonehash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
    };
    ABI(node: PromiseOrValue<BytesLike>, contentTypes: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber, string]>;
    'addr(bytes32)'(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    'addr(bytes32,uint256)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    approve(node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    clearRecords(node: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    contenthash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    dnsRecord(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, resource: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    hasDNSRecords(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    interfaceImplementer(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    isApprovedFor(owner: PromiseOrValue<string>, node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    multicall(data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    multicallWithNodeCheck(nodehash: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    name(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    pubkey(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string] & {
        x: string;
        y: string;
    }>;
    recordVersions(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    setABI(node: PromiseOrValue<BytesLike>, contentType: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    'setAddr(bytes32,uint256,bytes)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, a: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    'setAddr(bytes32,address)'(node: PromiseOrValue<BytesLike>, a: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setContenthash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setDNSRecords(node: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setInterface(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, implementer: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setName(node: PromiseOrValue<BytesLike>, newName: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setPubkey(node: PromiseOrValue<BytesLike>, x: PromiseOrValue<BytesLike>, y: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setText(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, value: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setZonehash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    text(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
    zonehash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        ABI(node: PromiseOrValue<BytesLike>, contentTypes: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber, string]>;
        'addr(bytes32)'(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        'addr(bytes32,uint256)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        approve(node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        clearRecords(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        contenthash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        dnsRecord(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, resource: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        hasDNSRecords(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        interfaceImplementer(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        isApprovedFor(owner: PromiseOrValue<string>, node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        multicall(data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<string[]>;
        multicallWithNodeCheck(nodehash: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: CallOverrides): Promise<string[]>;
        name(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        pubkey(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string, string] & {
            x: string;
            y: string;
        }>;
        recordVersions(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        setABI(node: PromiseOrValue<BytesLike>, contentType: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        'setAddr(bytes32,uint256,bytes)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, a: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        'setAddr(bytes32,address)'(node: PromiseOrValue<BytesLike>, a: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setContenthash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setDNSRecords(node: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setInterface(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, implementer: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setName(node: PromiseOrValue<BytesLike>, newName: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setPubkey(node: PromiseOrValue<BytesLike>, x: PromiseOrValue<BytesLike>, y: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setText(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, value: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setZonehash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        text(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<string>;
        zonehash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {
        'ABIChanged(bytes32,uint256)'(node?: PromiseOrValue<BytesLike> | null, contentType?: PromiseOrValue<BigNumberish> | null): ABIChangedEventFilter;
        ABIChanged(node?: PromiseOrValue<BytesLike> | null, contentType?: PromiseOrValue<BigNumberish> | null): ABIChangedEventFilter;
        'AddrChanged(bytes32,address)'(node?: PromiseOrValue<BytesLike> | null, a?: null): AddrChangedEventFilter;
        AddrChanged(node?: PromiseOrValue<BytesLike> | null, a?: null): AddrChangedEventFilter;
        'AddressChanged(bytes32,uint256,bytes)'(node?: PromiseOrValue<BytesLike> | null, coinType?: null, newAddress?: null): AddressChangedEventFilter;
        AddressChanged(node?: PromiseOrValue<BytesLike> | null, coinType?: null, newAddress?: null): AddressChangedEventFilter;
        'ApprovalForAll(address,address,bool)'(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(owner?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        'Approved(address,bytes32,address,bool)'(owner?: null, node?: PromiseOrValue<BytesLike> | null, delegate?: PromiseOrValue<string> | null, approved?: PromiseOrValue<boolean> | null): ApprovedEventFilter;
        Approved(owner?: null, node?: PromiseOrValue<BytesLike> | null, delegate?: PromiseOrValue<string> | null, approved?: PromiseOrValue<boolean> | null): ApprovedEventFilter;
        'ContenthashChanged(bytes32,bytes)'(node?: PromiseOrValue<BytesLike> | null, hash?: null): ContenthashChangedEventFilter;
        ContenthashChanged(node?: PromiseOrValue<BytesLike> | null, hash?: null): ContenthashChangedEventFilter;
        'DNSRecordChanged(bytes32,bytes,uint16,bytes)'(node?: PromiseOrValue<BytesLike> | null, name?: null, resource?: null, record?: null): DNSRecordChangedEventFilter;
        DNSRecordChanged(node?: PromiseOrValue<BytesLike> | null, name?: null, resource?: null, record?: null): DNSRecordChangedEventFilter;
        'DNSRecordDeleted(bytes32,bytes,uint16)'(node?: PromiseOrValue<BytesLike> | null, name?: null, resource?: null): DNSRecordDeletedEventFilter;
        DNSRecordDeleted(node?: PromiseOrValue<BytesLike> | null, name?: null, resource?: null): DNSRecordDeletedEventFilter;
        'DNSZonehashChanged(bytes32,bytes,bytes)'(node?: PromiseOrValue<BytesLike> | null, lastzonehash?: null, zonehash?: null): DNSZonehashChangedEventFilter;
        DNSZonehashChanged(node?: PromiseOrValue<BytesLike> | null, lastzonehash?: null, zonehash?: null): DNSZonehashChangedEventFilter;
        'InterfaceChanged(bytes32,bytes4,address)'(node?: PromiseOrValue<BytesLike> | null, interfaceID?: PromiseOrValue<BytesLike> | null, implementer?: null): InterfaceChangedEventFilter;
        InterfaceChanged(node?: PromiseOrValue<BytesLike> | null, interfaceID?: PromiseOrValue<BytesLike> | null, implementer?: null): InterfaceChangedEventFilter;
        'NameChanged(bytes32,string)'(node?: PromiseOrValue<BytesLike> | null, name?: null): NameChangedEventFilter;
        NameChanged(node?: PromiseOrValue<BytesLike> | null, name?: null): NameChangedEventFilter;
        'PubkeyChanged(bytes32,bytes32,bytes32)'(node?: PromiseOrValue<BytesLike> | null, x?: null, y?: null): PubkeyChangedEventFilter;
        PubkeyChanged(node?: PromiseOrValue<BytesLike> | null, x?: null, y?: null): PubkeyChangedEventFilter;
        'TextChanged(bytes32,string,string,string)'(node?: PromiseOrValue<BytesLike> | null, indexedKey?: PromiseOrValue<string> | null, key?: null, value?: null): TextChangedEventFilter;
        TextChanged(node?: PromiseOrValue<BytesLike> | null, indexedKey?: PromiseOrValue<string> | null, key?: null, value?: null): TextChangedEventFilter;
        'VersionChanged(bytes32,uint64)'(node?: PromiseOrValue<BytesLike> | null, newVersion?: null): VersionChangedEventFilter;
        VersionChanged(node?: PromiseOrValue<BytesLike> | null, newVersion?: null): VersionChangedEventFilter;
    };
    estimateGas: {
        ABI(node: PromiseOrValue<BytesLike>, contentTypes: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        'addr(bytes32)'(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        'addr(bytes32,uint256)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        approve(node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        clearRecords(node: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        contenthash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        dnsRecord(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, resource: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        hasDNSRecords(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        interfaceImplementer(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedFor(owner: PromiseOrValue<string>, node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        multicall(data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        multicallWithNodeCheck(nodehash: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        name(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        pubkey(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        recordVersions(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        setABI(node: PromiseOrValue<BytesLike>, contentType: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        'setAddr(bytes32,uint256,bytes)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, a: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        'setAddr(bytes32,address)'(node: PromiseOrValue<BytesLike>, a: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setContenthash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setDNSRecords(node: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setInterface(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, implementer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setName(node: PromiseOrValue<BytesLike>, newName: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setPubkey(node: PromiseOrValue<BytesLike>, x: PromiseOrValue<BytesLike>, y: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setText(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, value: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setZonehash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        text(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        zonehash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        ABI(node: PromiseOrValue<BytesLike>, contentTypes: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'addr(bytes32)'(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        'addr(bytes32,uint256)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        approve(node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        clearRecords(node: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        contenthash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        dnsRecord(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, resource: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        hasDNSRecords(node: PromiseOrValue<BytesLike>, name: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        interfaceImplementer(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedFor(owner: PromiseOrValue<string>, node: PromiseOrValue<BytesLike>, delegate: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        multicall(data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        multicallWithNodeCheck(nodehash: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>[], overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        name(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        pubkey(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        recordVersions(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        setABI(node: PromiseOrValue<BytesLike>, contentType: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        'setAddr(bytes32,uint256,bytes)'(node: PromiseOrValue<BytesLike>, coinType: PromiseOrValue<BigNumberish>, a: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        'setAddr(bytes32,address)'(node: PromiseOrValue<BytesLike>, a: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setContenthash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setDNSRecords(node: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setInterface(node: PromiseOrValue<BytesLike>, interfaceID: PromiseOrValue<BytesLike>, implementer: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setName(node: PromiseOrValue<BytesLike>, newName: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setPubkey(node: PromiseOrValue<BytesLike>, x: PromiseOrValue<BytesLike>, y: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setText(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, value: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setZonehash(node: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        supportsInterface(interfaceID: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        text(node: PromiseOrValue<BytesLike>, key: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        zonehash(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}