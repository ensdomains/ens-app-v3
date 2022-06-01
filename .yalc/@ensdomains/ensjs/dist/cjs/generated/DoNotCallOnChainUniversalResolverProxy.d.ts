import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from './common'
export declare namespace DoNotCallOnChainUniversalResolverProxy {
  type ReverseCallStruct = {
    target: string
    data: BytesLike
    dataType: BigNumberish
    locations: BigNumberish[]
  }
  type ReverseCallStructOutput = [string, string, number, BigNumber[]] & {
    target: string
    data: string
    dataType: number
    locations: BigNumber[]
  }
}
export interface DoNotCallOnChainUniversalResolverProxyInterface
  extends utils.Interface {
  functions: {
    'isOwner(address)': FunctionFragment
    'owner()': FunctionFragment
    'reverse(bytes,(address,bytes,uint8,uint256[])[])': FunctionFragment
    'setUniversalResolver(address)': FunctionFragment
    'transferOwnership(address)': FunctionFragment
    'universalResolver()': FunctionFragment
  }
  getFunction(
    nameOrSignatureOrTopic:
      | 'isOwner'
      | 'owner'
      | 'reverse'
      | 'setUniversalResolver'
      | 'transferOwnership'
      | 'universalResolver',
  ): FunctionFragment
  encodeFunctionData(functionFragment: 'isOwner', values: [string]): string
  encodeFunctionData(functionFragment: 'owner', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'reverse',
    values: [
      BytesLike,
      DoNotCallOnChainUniversalResolverProxy.ReverseCallStruct[],
    ],
  ): string
  encodeFunctionData(
    functionFragment: 'setUniversalResolver',
    values: [string],
  ): string
  encodeFunctionData(
    functionFragment: 'transferOwnership',
    values: [string],
  ): string
  encodeFunctionData(
    functionFragment: 'universalResolver',
    values?: undefined,
  ): string
  decodeFunctionResult(functionFragment: 'isOwner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'owner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'reverse', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'setUniversalResolver',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'transferOwnership',
    data: BytesLike,
  ): Result
  decodeFunctionResult(
    functionFragment: 'universalResolver',
    data: BytesLike,
  ): Result
  events: {
    'OwnershipTransferred(address,address)': EventFragment
  }
  getEvent(nameOrSignatureOrTopic: 'OwnershipTransferred'): EventFragment
}
export interface OwnershipTransferredEventObject {
  previousOwner: string
  newOwner: string
}
export declare type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>
export declare type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>
export interface DoNotCallOnChainUniversalResolverProxy extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>
  interface: DoNotCallOnChainUniversalResolverProxyInterface
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>
  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>,
  ): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>,
  ): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>
  functions: {
    isOwner(addr: string, overrides?: CallOverrides): Promise<[boolean]>
    owner(overrides?: CallOverrides): Promise<[string]>
    reverse(
      reverseNode: BytesLike,
      calls: DoNotCallOnChainUniversalResolverProxy.ReverseCallStruct[],
      overrides?: CallOverrides,
    ): Promise<
      [string, string[]] & {
        name: string
        returnData: string[]
      }
    >
    setUniversalResolver(
      newUniversalResolver: string,
      overrides?: Overrides & {
        from?: string | Promise<string>
      },
    ): Promise<ContractTransaction>
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>
      },
    ): Promise<ContractTransaction>
    universalResolver(overrides?: CallOverrides): Promise<[string]>
  }
  isOwner(addr: string, overrides?: CallOverrides): Promise<boolean>
  owner(overrides?: CallOverrides): Promise<string>
  reverse(
    reverseNode: BytesLike,
    calls: DoNotCallOnChainUniversalResolverProxy.ReverseCallStruct[],
    overrides?: CallOverrides,
  ): Promise<
    [string, string[]] & {
      name: string
      returnData: string[]
    }
  >
  setUniversalResolver(
    newUniversalResolver: string,
    overrides?: Overrides & {
      from?: string | Promise<string>
    },
  ): Promise<ContractTransaction>
  transferOwnership(
    newOwner: string,
    overrides?: Overrides & {
      from?: string | Promise<string>
    },
  ): Promise<ContractTransaction>
  universalResolver(overrides?: CallOverrides): Promise<string>
  callStatic: {
    isOwner(addr: string, overrides?: CallOverrides): Promise<boolean>
    owner(overrides?: CallOverrides): Promise<string>
    reverse(
      reverseNode: BytesLike,
      calls: DoNotCallOnChainUniversalResolverProxy.ReverseCallStruct[],
      overrides?: CallOverrides,
    ): Promise<
      [string, string[]] & {
        name: string
        returnData: string[]
      }
    >
    setUniversalResolver(
      newUniversalResolver: string,
      overrides?: CallOverrides,
    ): Promise<void>
    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides,
    ): Promise<void>
    universalResolver(overrides?: CallOverrides): Promise<string>
  }
  filters: {
    'OwnershipTransferred(address,address)'(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null,
    ): OwnershipTransferredEventFilter
  }
  estimateGas: {
    isOwner(addr: string, overrides?: CallOverrides): Promise<BigNumber>
    owner(overrides?: CallOverrides): Promise<BigNumber>
    reverse(
      reverseNode: BytesLike,
      calls: DoNotCallOnChainUniversalResolverProxy.ReverseCallStruct[],
      overrides?: CallOverrides,
    ): Promise<BigNumber>
    setUniversalResolver(
      newUniversalResolver: string,
      overrides?: Overrides & {
        from?: string | Promise<string>
      },
    ): Promise<BigNumber>
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>
      },
    ): Promise<BigNumber>
    universalResolver(overrides?: CallOverrides): Promise<BigNumber>
  }
  populateTransaction: {
    isOwner(
      addr: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>
    reverse(
      reverseNode: BytesLike,
      calls: DoNotCallOnChainUniversalResolverProxy.ReverseCallStruct[],
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
    setUniversalResolver(
      newUniversalResolver: string,
      overrides?: Overrides & {
        from?: string | Promise<string>
      },
    ): Promise<PopulatedTransaction>
    transferOwnership(
      newOwner: string,
      overrides?: Overrides & {
        from?: string | Promise<string>
      },
    ): Promise<PopulatedTransaction>
    universalResolver(overrides?: CallOverrides): Promise<PopulatedTransaction>
  }
}
