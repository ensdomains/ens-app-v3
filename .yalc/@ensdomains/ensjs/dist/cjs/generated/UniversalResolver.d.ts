import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers'
import type { FunctionFragment, Result } from '@ethersproject/abi'
import type { Listener, Provider } from '@ethersproject/providers'
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from './common'
export interface UniversalResolverInterface extends utils.Interface {
  functions: {
    'findResolver(bytes)': FunctionFragment
    'registry()': FunctionFragment
    'resolve(bytes,bytes)': FunctionFragment
    'resolveCallback(bytes,bytes)': FunctionFragment
    'reverse(bytes)': FunctionFragment
    'supportsInterface(bytes4)': FunctionFragment
  }
  getFunction(
    nameOrSignatureOrTopic:
      | 'findResolver'
      | 'registry'
      | 'resolve'
      | 'resolveCallback'
      | 'reverse'
      | 'supportsInterface',
  ): FunctionFragment
  encodeFunctionData(
    functionFragment: 'findResolver',
    values: [BytesLike],
  ): string
  encodeFunctionData(functionFragment: 'registry', values?: undefined): string
  encodeFunctionData(
    functionFragment: 'resolve',
    values: [BytesLike, BytesLike],
  ): string
  encodeFunctionData(
    functionFragment: 'resolveCallback',
    values: [BytesLike, BytesLike],
  ): string
  encodeFunctionData(functionFragment: 'reverse', values: [BytesLike]): string
  encodeFunctionData(
    functionFragment: 'supportsInterface',
    values: [BytesLike],
  ): string
  decodeFunctionResult(
    functionFragment: 'findResolver',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'registry', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'resolve', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'resolveCallback',
    data: BytesLike,
  ): Result
  decodeFunctionResult(functionFragment: 'reverse', data: BytesLike): Result
  decodeFunctionResult(
    functionFragment: 'supportsInterface',
    data: BytesLike,
  ): Result
  events: {}
}
export interface UniversalResolver extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>
  interface: UniversalResolverInterface
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
    findResolver(
      name: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string, string]>
    registry(overrides?: CallOverrides): Promise<[string]>
    resolve(
      name: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string, string]>
    resolveCallback(
      response: BytesLike,
      extraData: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string]>
    reverse(
      reverseNode: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string, string]>
    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[boolean]>
  }
  findResolver(
    name: BytesLike,
    overrides?: CallOverrides,
  ): Promise<[string, string]>
  registry(overrides?: CallOverrides): Promise<string>
  resolve(
    name: BytesLike,
    data: BytesLike,
    overrides?: CallOverrides,
  ): Promise<[string, string]>
  resolveCallback(
    response: BytesLike,
    extraData: BytesLike,
    overrides?: CallOverrides,
  ): Promise<string>
  reverse(
    reverseNode: BytesLike,
    overrides?: CallOverrides,
  ): Promise<[string, string]>
  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides,
  ): Promise<boolean>
  callStatic: {
    findResolver(
      name: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string, string]>
    registry(overrides?: CallOverrides): Promise<string>
    resolve(
      name: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string, string]>
    resolveCallback(
      response: BytesLike,
      extraData: BytesLike,
      overrides?: CallOverrides,
    ): Promise<string>
    reverse(
      reverseNode: BytesLike,
      overrides?: CallOverrides,
    ): Promise<[string, string]>
    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides,
    ): Promise<boolean>
  }
  filters: {}
  estimateGas: {
    findResolver(name: BytesLike, overrides?: CallOverrides): Promise<BigNumber>
    registry(overrides?: CallOverrides): Promise<BigNumber>
    resolve(
      name: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides,
    ): Promise<BigNumber>
    resolveCallback(
      response: BytesLike,
      extraData: BytesLike,
      overrides?: CallOverrides,
    ): Promise<BigNumber>
    reverse(
      reverseNode: BytesLike,
      overrides?: CallOverrides,
    ): Promise<BigNumber>
    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides,
    ): Promise<BigNumber>
  }
  populateTransaction: {
    findResolver(
      name: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
    registry(overrides?: CallOverrides): Promise<PopulatedTransaction>
    resolve(
      name: BytesLike,
      data: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
    resolveCallback(
      response: BytesLike,
      extraData: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
    reverse(
      reverseNode: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>
  }
}
