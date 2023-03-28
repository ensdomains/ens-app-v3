import type { FunctionFragment, Result } from '@ethersproject/abi';
import { Interface } from '@ethersproject/abi';
import type { Listener, Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import type { BytesLike } from '@ethersproject/bytes';
import type { BaseContract, CallOverrides, PopulatedTransaction } from '@ethersproject/contracts';
import type { OnEvent, PromiseOrValue, TypedEvent, TypedEventFilter, TypedListener } from './common';
export interface SHA1NSEC3DigestInterface extends Interface {
    functions: {
        'hash(bytes,bytes,uint256)': FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: 'hash'): FunctionFragment;
    encodeFunctionData(functionFragment: 'hash', values: [
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BytesLike>,
        PromiseOrValue<BigNumberish>
    ]): string;
    decodeFunctionResult(functionFragment: 'hash', data: BytesLike): Result;
    events: {};
}
export interface SHA1NSEC3Digest extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SHA1NSEC3DigestInterface;
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
         * Performs an NSEC3 iterated hash.
         * @param data The data to hash.
         * @param iterations The number of iterations to perform.
         * @param salt The salt value to use on each iteration.
         */
        hash(salt: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, iterations: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<[string]>;
    };
    /**
     * Performs an NSEC3 iterated hash.
     * @param data The data to hash.
     * @param iterations The number of iterations to perform.
     * @param salt The salt value to use on each iteration.
     */
    hash(salt: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, iterations: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    callStatic: {
        /**
         * Performs an NSEC3 iterated hash.
         * @param data The data to hash.
         * @param iterations The number of iterations to perform.
         * @param salt The salt value to use on each iteration.
         */
        hash(salt: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, iterations: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<string>;
    };
    filters: {};
    estimateGas: {
        /**
         * Performs an NSEC3 iterated hash.
         * @param data The data to hash.
         * @param iterations The number of iterations to perform.
         * @param salt The salt value to use on each iteration.
         */
        hash(salt: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, iterations: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        /**
         * Performs an NSEC3 iterated hash.
         * @param data The data to hash.
         * @param iterations The number of iterations to perform.
         * @param salt The salt value to use on each iteration.
         */
        hash(salt: PromiseOrValue<BytesLike>, data: PromiseOrValue<BytesLike>, iterations: PromiseOrValue<BigNumberish>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
