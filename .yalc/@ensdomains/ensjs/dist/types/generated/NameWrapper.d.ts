import type { EventFragment, FunctionFragment, Result } from '@ethersproject/abi';
import { Interface } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { BaseContract, CallOverrides, ContractTransaction, Overrides, PopulatedTransaction } from '@ethersproject/contracts';
import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from './common';
export interface NameWrapperInterface extends Interface {
    functions: {
        '_tokens(uint256)': FunctionFragment;
        'allFusesBurned(bytes32,uint32)': FunctionFragment;
        'balanceOf(address,uint256)': FunctionFragment;
        'balanceOfBatch(address[],uint256[])': FunctionFragment;
        'canModifyName(bytes32,address)': FunctionFragment;
        'controllers(address)': FunctionFragment;
        'ens()': FunctionFragment;
        'extendExpiry(bytes32,bytes32,uint64)': FunctionFragment;
        'getData(uint256)': FunctionFragment;
        'isApprovedForAll(address,address)': FunctionFragment;
        'isWrapped(bytes32)': FunctionFragment;
        'metadataService()': FunctionFragment;
        'name()': FunctionFragment;
        'names(bytes32)': FunctionFragment;
        'onERC721Received(address,address,uint256,bytes)': FunctionFragment;
        'owner()': FunctionFragment;
        'ownerOf(uint256)': FunctionFragment;
        'recoverFunds(address,address,uint256)': FunctionFragment;
        'registerAndWrapETH2LD(string,address,uint256,address,uint16)': FunctionFragment;
        'registrar()': FunctionFragment;
        'renew(uint256,uint256)': FunctionFragment;
        'renounceOwnership()': FunctionFragment;
        'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)': FunctionFragment;
        'safeTransferFrom(address,address,uint256,uint256,bytes)': FunctionFragment;
        'setApprovalForAll(address,bool)': FunctionFragment;
        'setChildFuses(bytes32,bytes32,uint32,uint64)': FunctionFragment;
        'setController(address,bool)': FunctionFragment;
        'setFuses(bytes32,uint16)': FunctionFragment;
        'setMetadataService(address)': FunctionFragment;
        'setRecord(bytes32,address,address,uint64)': FunctionFragment;
        'setResolver(bytes32,address)': FunctionFragment;
        'setSubnodeOwner(bytes32,string,address,uint32,uint64)': FunctionFragment;
        'setSubnodeRecord(bytes32,string,address,address,uint64,uint32,uint64)': FunctionFragment;
        'setTTL(bytes32,uint64)': FunctionFragment;
        'setUpgradeContract(address)': FunctionFragment;
        'supportsInterface(bytes4)': FunctionFragment;
        'transferOwnership(address)': FunctionFragment;
        'unwrap(bytes32,bytes32,address)': FunctionFragment;
        'unwrapETH2LD(bytes32,address,address)': FunctionFragment;
        'upgrade(bytes32,string,address,address)': FunctionFragment;
        'upgradeContract()': FunctionFragment;
        'upgradeETH2LD(string,address,address)': FunctionFragment;
        'uri(uint256)': FunctionFragment;
        'wrap(bytes,address,address)': FunctionFragment;
        'wrapETH2LD(string,address,uint16,address)': FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: '_tokens' | 'allFusesBurned' | 'balanceOf' | 'balanceOfBatch' | 'canModifyName' | 'controllers' | 'ens' | 'extendExpiry' | 'getData' | 'isApprovedForAll' | 'isWrapped' | 'metadataService' | 'name' | 'names' | 'onERC721Received' | 'owner' | 'ownerOf' | 'recoverFunds' | 'registerAndWrapETH2LD' | 'registrar' | 'renew' | 'renounceOwnership' | 'safeBatchTransferFrom' | 'safeTransferFrom' | 'setApprovalForAll' | 'setChildFuses' | 'setController' | 'setFuses' | 'setMetadataService' | 'setRecord' | 'setResolver' | 'setSubnodeOwner' | 'setSubnodeRecord' | 'setTTL' | 'setUpgradeContract' | 'supportsInterface' | 'transferOwnership' | 'unwrap' | 'unwrapETH2LD' | 'upgrade' | 'upgradeContract' | 'upgradeETH2LD' | 'uri' | 'wrap' | 'wrapETH2LD'): FunctionFragment;
    encodeFunctionData(functionFragment: '_tokens', values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'allFusesBurned', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'balanceOf', values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'balanceOfBatch', values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]): string;
    encodeFunctionData(functionFragment: 'canModifyName', values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'controllers', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'ens', values?: undefined): string;
    encodeFunctionData(functionFragment: 'extendExpiry', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'getData', values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'isApprovedForAll', values: [PromiseOrValue<string>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'isWrapped', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'metadataService', values?: undefined): string;
    encodeFunctionData(functionFragment: 'name', values?: undefined): string;
    encodeFunctionData(functionFragment: 'names', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'onERC721Received', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'owner', values?: undefined): string;
    encodeFunctionData(functionFragment: 'ownerOf', values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'recoverFunds', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'registerAndWrapETH2LD', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'registrar', values?: undefined): string;
    encodeFunctionData(functionFragment: 'renew', values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'renounceOwnership', values?: undefined): string;
    encodeFunctionData(functionFragment: 'safeBatchTransferFrom', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BigNumberish>[],
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'safeTransferFrom', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BytesLike>
    ]): string;
    encodeFunctionData(functionFragment: 'setApprovalForAll', values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: 'setChildFuses', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'setController', values: [PromiseOrValue<string>, PromiseOrValue<boolean>]): string;
    encodeFunctionData(functionFragment: 'setFuses', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'setMetadataService', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'setRecord', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'setResolver', values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'setSubnodeOwner', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'setSubnodeRecord', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<BigNumberish>
    ]): string;
    encodeFunctionData(functionFragment: 'setTTL', values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'setUpgradeContract', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'supportsInterface', values: [PromiseOrValue<BytesLike>]): string;
    encodeFunctionData(functionFragment: 'transferOwnership', values: [PromiseOrValue<string>]): string;
    encodeFunctionData(functionFragment: 'unwrap', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'unwrapETH2LD', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'upgrade', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'upgradeContract', values?: undefined): string;
    encodeFunctionData(functionFragment: 'upgradeETH2LD', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'uri', values: [PromiseOrValue<BigNumberish>]): string;
    encodeFunctionData(functionFragment: 'wrap', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
    ]): string;
    encodeFunctionData(functionFragment: 'wrapETH2LD', values: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<BigNumberish>,
        PromiseOrValue<string>
    ]): string;
    decodeFunctionResult(functionFragment: '_tokens', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'allFusesBurned', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'balanceOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'balanceOfBatch', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'canModifyName', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'controllers', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'ens', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'extendExpiry', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'getData', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'isApprovedForAll', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'isWrapped', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'metadataService', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'name', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'names', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'onERC721Received', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'ownerOf', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'recoverFunds', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'registerAndWrapETH2LD', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'registrar', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'renew', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'renounceOwnership', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'safeBatchTransferFrom', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'safeTransferFrom', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setApprovalForAll', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setChildFuses', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setController', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setFuses', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setMetadataService', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setRecord', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setResolver', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setSubnodeOwner', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setSubnodeRecord', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setTTL', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'setUpgradeContract', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'supportsInterface', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'transferOwnership', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'unwrap', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'unwrapETH2LD', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'upgrade', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'upgradeContract', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'upgradeETH2LD', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'uri', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'wrap', data: BytesLike): Result;
    decodeFunctionResult(functionFragment: 'wrapETH2LD', data: BytesLike): Result;
    events: {
        'ApprovalForAll(address,address,bool)': EventFragment;
        'ControllerChanged(address,bool)': EventFragment;
        'ExpiryExtended(bytes32,uint64)': EventFragment;
        'FusesSet(bytes32,uint32)': EventFragment;
        'NameUnwrapped(bytes32,address)': EventFragment;
        'NameWrapped(bytes32,bytes,address,uint32,uint64)': EventFragment;
        'OwnershipTransferred(address,address)': EventFragment;
        'TransferBatch(address,address,address,uint256[],uint256[])': EventFragment;
        'TransferSingle(address,address,address,uint256,uint256)': EventFragment;
        'URI(string,uint256)': EventFragment;
    };
    getEvent(nameOrSignatureOrTopic: 'ApprovalForAll'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'ControllerChanged'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'ExpiryExtended'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'FusesSet'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'NameUnwrapped'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'NameWrapped'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'TransferBatch'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'TransferSingle'): EventFragment;
    getEvent(nameOrSignatureOrTopic: 'URI'): EventFragment;
}
export interface ApprovalForAllEventObject {
    account: string;
    operator: string;
    approved: boolean;
}
export declare type ApprovalForAllEvent = TypedEvent<[
    string,
    string,
    boolean
], ApprovalForAllEventObject>;
export declare type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;
export interface ControllerChangedEventObject {
    controller: string;
    active: boolean;
}
export declare type ControllerChangedEvent = TypedEvent<[
    string,
    boolean
], ControllerChangedEventObject>;
export declare type ControllerChangedEventFilter = TypedEventFilter<ControllerChangedEvent>;
export interface ExpiryExtendedEventObject {
    node: string;
    expiry: BigNumber;
}
export declare type ExpiryExtendedEvent = TypedEvent<[
    string,
    BigNumber
], ExpiryExtendedEventObject>;
export declare type ExpiryExtendedEventFilter = TypedEventFilter<ExpiryExtendedEvent>;
export interface FusesSetEventObject {
    node: string;
    fuses: number;
}
export declare type FusesSetEvent = TypedEvent<[string, number], FusesSetEventObject>;
export declare type FusesSetEventFilter = TypedEventFilter<FusesSetEvent>;
export interface NameUnwrappedEventObject {
    node: string;
    owner: string;
}
export declare type NameUnwrappedEvent = TypedEvent<[
    string,
    string
], NameUnwrappedEventObject>;
export declare type NameUnwrappedEventFilter = TypedEventFilter<NameUnwrappedEvent>;
export interface NameWrappedEventObject {
    node: string;
    name: string;
    owner: string;
    fuses: number;
    expiry: BigNumber;
}
export declare type NameWrappedEvent = TypedEvent<[
    string,
    string,
    string,
    number,
    BigNumber
], NameWrappedEventObject>;
export declare type NameWrappedEventFilter = TypedEventFilter<NameWrappedEvent>;
export interface OwnershipTransferredEventObject {
    previousOwner: string;
    newOwner: string;
}
export declare type OwnershipTransferredEvent = TypedEvent<[
    string,
    string
], OwnershipTransferredEventObject>;
export declare type OwnershipTransferredEventFilter = TypedEventFilter<OwnershipTransferredEvent>;
export interface TransferBatchEventObject {
    operator: string;
    from: string;
    to: string;
    ids: BigNumber[];
    values: BigNumber[];
}
export declare type TransferBatchEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber[],
    BigNumber[]
], TransferBatchEventObject>;
export declare type TransferBatchEventFilter = TypedEventFilter<TransferBatchEvent>;
export interface TransferSingleEventObject {
    operator: string;
    from: string;
    to: string;
    id: BigNumber;
    value: BigNumber;
}
export declare type TransferSingleEvent = TypedEvent<[
    string,
    string,
    string,
    BigNumber,
    BigNumber
], TransferSingleEventObject>;
export declare type TransferSingleEventFilter = TypedEventFilter<TransferSingleEvent>;
export interface URIEventObject {
    value: string;
    id: BigNumber;
}
export declare type URIEvent = TypedEvent<[string, BigNumber], URIEventObject>;
export declare type URIEventFilter = TypedEventFilter<URIEvent>;
export interface NameWrapper extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: NameWrapperInterface;
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
        _tokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        allFusesBurned(node: PromiseOrValue<BytesLike>, fuseMask: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[boolean]>;
        balanceOf(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[BigNumber]>;
        balanceOfBatch(accounts: PromiseOrValue<string>[], ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<[BigNumber[]]>;
        canModifyName(node: PromiseOrValue<BytesLike>, addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        controllers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        ens(overrides?: CallOverrides): Promise<[string]>;
        extendExpiry(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        getData(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            number,
            BigNumber
        ] & {
            owner: string;
            fuses: number;
            expiry: BigNumber;
        }>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<[boolean]>;
        isWrapped(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        metadataService(overrides?: CallOverrides): Promise<[string]>;
        name(overrides?: CallOverrides): Promise<[string]>;
        names(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[string]>;
        onERC721Received(to: PromiseOrValue<string>, arg1: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        owner(overrides?: CallOverrides): Promise<[string]>;
        ownerOf(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string] & {
            owner: string;
        }>;
        recoverFunds(_token: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        registerAndWrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, duration: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        registrar(overrides?: CallOverrides): Promise<[string]>;
        renew(tokenId: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        safeBatchTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        safeTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setChildFuses(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setController(controller: PromiseOrValue<string>, active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setFuses(node: PromiseOrValue<BytesLike>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setMetadataService(_metadataService: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setRecord(node: PromiseOrValue<BytesLike>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setResolver(node: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSubnodeOwner(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setSubnodeRecord(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setTTL(node: PromiseOrValue<BytesLike>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        setUpgradeContract(_upgradeAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        unwrap(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, controller: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        unwrapETH2LD(labelhash: PromiseOrValue<BytesLike>, registrant: PromiseOrValue<string>, controller: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgrade(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        upgradeContract(overrides?: CallOverrides): Promise<[string]>;
        upgradeETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        uri(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
        wrap(name: PromiseOrValue<BytesLike>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
        wrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<ContractTransaction>;
    };
    _tokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    allFusesBurned(node: PromiseOrValue<BytesLike>, fuseMask: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
    balanceOf(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    balanceOfBatch(accounts: PromiseOrValue<string>[], ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
    canModifyName(node: PromiseOrValue<BytesLike>, addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    controllers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    ens(overrides?: CallOverrides): Promise<string>;
    extendExpiry(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    getData(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
        string,
        number,
        BigNumber
    ] & {
        owner: string;
        fuses: number;
        expiry: BigNumber;
    }>;
    isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
    isWrapped(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    metadataService(overrides?: CallOverrides): Promise<string>;
    name(overrides?: CallOverrides): Promise<string>;
    names(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
    onERC721Received(to: PromiseOrValue<string>, arg1: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    owner(overrides?: CallOverrides): Promise<string>;
    ownerOf(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    recoverFunds(_token: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    registerAndWrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, duration: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    registrar(overrides?: CallOverrides): Promise<string>;
    renew(tokenId: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    renounceOwnership(overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    safeBatchTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    safeTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setChildFuses(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setController(controller: PromiseOrValue<string>, active: PromiseOrValue<boolean>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setFuses(node: PromiseOrValue<BytesLike>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setMetadataService(_metadataService: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setRecord(node: PromiseOrValue<BytesLike>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setResolver(node: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSubnodeOwner(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setSubnodeRecord(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setTTL(node: PromiseOrValue<BytesLike>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    setUpgradeContract(_upgradeAddress: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    unwrap(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, controller: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    unwrapETH2LD(labelhash: PromiseOrValue<BytesLike>, registrant: PromiseOrValue<string>, controller: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgrade(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    upgradeContract(overrides?: CallOverrides): Promise<string>;
    upgradeETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    uri(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    wrap(name: PromiseOrValue<BytesLike>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    wrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ContractTransaction>;
    callStatic: {
        _tokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        allFusesBurned(node: PromiseOrValue<BytesLike>, fuseMask: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<boolean>;
        balanceOf(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOfBatch(accounts: PromiseOrValue<string>[], ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber[]>;
        canModifyName(node: PromiseOrValue<BytesLike>, addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        controllers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        ens(overrides?: CallOverrides): Promise<string>;
        extendExpiry(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, expiry: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        getData(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[
            string,
            number,
            BigNumber
        ] & {
            owner: string;
            fuses: number;
            expiry: BigNumber;
        }>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<boolean>;
        isWrapped(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        metadataService(overrides?: CallOverrides): Promise<string>;
        name(overrides?: CallOverrides): Promise<string>;
        names(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        onERC721Received(to: PromiseOrValue<string>, arg1: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<string>;
        owner(overrides?: CallOverrides): Promise<string>;
        ownerOf(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        recoverFunds(_token: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        registerAndWrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, duration: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        registrar(overrides?: CallOverrides): Promise<string>;
        renew(tokenId: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        renounceOwnership(overrides?: CallOverrides): Promise<void>;
        safeBatchTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        safeTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<void>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setChildFuses(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setController(controller: PromiseOrValue<string>, active: PromiseOrValue<boolean>, overrides?: CallOverrides): Promise<void>;
        setFuses(node: PromiseOrValue<BytesLike>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<number>;
        setMetadataService(_metadataService: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setRecord(node: PromiseOrValue<BytesLike>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setResolver(node: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        setSubnodeOwner(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        setSubnodeRecord(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        setTTL(node: PromiseOrValue<BytesLike>, ttl: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<void>;
        setUpgradeContract(_upgradeAddress: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        unwrap(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, controller: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        unwrapETH2LD(labelhash: PromiseOrValue<BytesLike>, registrant: PromiseOrValue<string>, controller: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgrade(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        upgradeContract(overrides?: CallOverrides): Promise<string>;
        upgradeETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        uri(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
        wrap(name: PromiseOrValue<BytesLike>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
        wrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, overrides?: CallOverrides): Promise<void>;
    };
    filters: {
        'ApprovalForAll(address,address,bool)'(account?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        ApprovalForAll(account?: PromiseOrValue<string> | null, operator?: PromiseOrValue<string> | null, approved?: null): ApprovalForAllEventFilter;
        'ControllerChanged(address,bool)'(controller?: PromiseOrValue<string> | null, active?: null): ControllerChangedEventFilter;
        ControllerChanged(controller?: PromiseOrValue<string> | null, active?: null): ControllerChangedEventFilter;
        'ExpiryExtended(bytes32,uint64)'(node?: PromiseOrValue<BytesLike> | null, expiry?: null): ExpiryExtendedEventFilter;
        ExpiryExtended(node?: PromiseOrValue<BytesLike> | null, expiry?: null): ExpiryExtendedEventFilter;
        'FusesSet(bytes32,uint32)'(node?: PromiseOrValue<BytesLike> | null, fuses?: null): FusesSetEventFilter;
        FusesSet(node?: PromiseOrValue<BytesLike> | null, fuses?: null): FusesSetEventFilter;
        'NameUnwrapped(bytes32,address)'(node?: PromiseOrValue<BytesLike> | null, owner?: null): NameUnwrappedEventFilter;
        NameUnwrapped(node?: PromiseOrValue<BytesLike> | null, owner?: null): NameUnwrappedEventFilter;
        'NameWrapped(bytes32,bytes,address,uint32,uint64)'(node?: PromiseOrValue<BytesLike> | null, name?: null, owner?: null, fuses?: null, expiry?: null): NameWrappedEventFilter;
        NameWrapped(node?: PromiseOrValue<BytesLike> | null, name?: null, owner?: null, fuses?: null, expiry?: null): NameWrappedEventFilter;
        'OwnershipTransferred(address,address)'(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        OwnershipTransferred(previousOwner?: PromiseOrValue<string> | null, newOwner?: PromiseOrValue<string> | null): OwnershipTransferredEventFilter;
        'TransferBatch(address,address,address,uint256[],uint256[])'(operator?: PromiseOrValue<string> | null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, ids?: null, values?: null): TransferBatchEventFilter;
        TransferBatch(operator?: PromiseOrValue<string> | null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, ids?: null, values?: null): TransferBatchEventFilter;
        'TransferSingle(address,address,address,uint256,uint256)'(operator?: PromiseOrValue<string> | null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, id?: null, value?: null): TransferSingleEventFilter;
        TransferSingle(operator?: PromiseOrValue<string> | null, from?: PromiseOrValue<string> | null, to?: PromiseOrValue<string> | null, id?: null, value?: null): TransferSingleEventFilter;
        'URI(string,uint256)'(value?: null, id?: PromiseOrValue<BigNumberish> | null): URIEventFilter;
        URI(value?: null, id?: PromiseOrValue<BigNumberish> | null): URIEventFilter;
    };
    estimateGas: {
        _tokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        allFusesBurned(node: PromiseOrValue<BytesLike>, fuseMask: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOf(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        balanceOfBatch(accounts: PromiseOrValue<string>[], ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<BigNumber>;
        canModifyName(node: PromiseOrValue<BytesLike>, addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        controllers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        ens(overrides?: CallOverrides): Promise<BigNumber>;
        extendExpiry(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        getData(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<BigNumber>;
        isWrapped(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        metadataService(overrides?: CallOverrides): Promise<BigNumber>;
        name(overrides?: CallOverrides): Promise<BigNumber>;
        names(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        onERC721Received(to: PromiseOrValue<string>, arg1: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        owner(overrides?: CallOverrides): Promise<BigNumber>;
        ownerOf(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        recoverFunds(_token: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        registerAndWrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, duration: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        registrar(overrides?: CallOverrides): Promise<BigNumber>;
        renew(tokenId: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        safeBatchTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        safeTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setChildFuses(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setController(controller: PromiseOrValue<string>, active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setFuses(node: PromiseOrValue<BytesLike>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setMetadataService(_metadataService: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setRecord(node: PromiseOrValue<BytesLike>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setResolver(node: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSubnodeOwner(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setSubnodeRecord(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setTTL(node: PromiseOrValue<BytesLike>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        setUpgradeContract(_upgradeAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        unwrap(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, controller: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        unwrapETH2LD(labelhash: PromiseOrValue<BytesLike>, registrant: PromiseOrValue<string>, controller: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgrade(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        upgradeContract(overrides?: CallOverrides): Promise<BigNumber>;
        upgradeETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        uri(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
        wrap(name: PromiseOrValue<BytesLike>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
        wrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<BigNumber>;
    };
    populateTransaction: {
        _tokens(arg0: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        allFusesBurned(node: PromiseOrValue<BytesLike>, fuseMask: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOf(account: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        balanceOfBatch(accounts: PromiseOrValue<string>[], ids: PromiseOrValue<BigNumberish>[], overrides?: CallOverrides): Promise<PopulatedTransaction>;
        canModifyName(node: PromiseOrValue<BytesLike>, addr: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        controllers(arg0: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        extendExpiry(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        getData(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isApprovedForAll(account: PromiseOrValue<string>, operator: PromiseOrValue<string>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        isWrapped(node: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        metadataService(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        name(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        names(arg0: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        onERC721Received(to: PromiseOrValue<string>, arg1: PromiseOrValue<string>, tokenId: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        ownerOf(id: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        recoverFunds(_token: PromiseOrValue<string>, _to: PromiseOrValue<string>, _amount: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        registerAndWrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, duration: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        registrar(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        renew(tokenId: PromiseOrValue<BigNumberish>, duration: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        renounceOwnership(overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        safeBatchTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, ids: PromiseOrValue<BigNumberish>[], amounts: PromiseOrValue<BigNumberish>[], data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        safeTransferFrom(from: PromiseOrValue<string>, to: PromiseOrValue<string>, id: PromiseOrValue<BigNumberish>, amount: PromiseOrValue<BigNumberish>, data: PromiseOrValue<BytesLike>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setApprovalForAll(operator: PromiseOrValue<string>, approved: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setChildFuses(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setController(controller: PromiseOrValue<string>, active: PromiseOrValue<boolean>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setFuses(node: PromiseOrValue<BytesLike>, ownerControlledFuses: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setMetadataService(_metadataService: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setRecord(node: PromiseOrValue<BytesLike>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setResolver(node: PromiseOrValue<BytesLike>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSubnodeOwner(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setSubnodeRecord(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, owner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, ttl: PromiseOrValue<BigNumberish>, fuses: PromiseOrValue<BigNumberish>, expiry: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setTTL(node: PromiseOrValue<BytesLike>, ttl: PromiseOrValue<BigNumberish>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        setUpgradeContract(_upgradeAddress: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        supportsInterface(interfaceId: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        transferOwnership(newOwner: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        unwrap(parentNode: PromiseOrValue<BytesLike>, labelhash: PromiseOrValue<BytesLike>, controller: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        unwrapETH2LD(labelhash: PromiseOrValue<BytesLike>, registrant: PromiseOrValue<string>, controller: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgrade(parentNode: PromiseOrValue<BytesLike>, label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        upgradeContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;
        upgradeETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        uri(tokenId: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
        wrap(name: PromiseOrValue<BytesLike>, wrappedOwner: PromiseOrValue<string>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
        wrapETH2LD(label: PromiseOrValue<string>, wrappedOwner: PromiseOrValue<string>, ownerControlledFuses: PromiseOrValue<BigNumberish>, resolver: PromiseOrValue<string>, overrides?: Overrides & {
            from?: PromiseOrValue<string>;
        }): Promise<PopulatedTransaction>;
    };
}
