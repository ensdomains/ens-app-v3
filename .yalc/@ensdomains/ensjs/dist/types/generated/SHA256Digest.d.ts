import type { BaseContract, BigNumber, BytesLike, CallOverrides, PopulatedTransaction, Signer, utils } from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type { TypedEventFilter, TypedEvent, TypedListener, OnEvent, PromiseOrValue } from "./common";
export interface SHA256DigestInterface extends utils.Interface {
    functions: {
        "verify(bytes,bytes)": FunctionFragment;
    };
    getFunction(nameOrSignatureOrTopic: "verify"): FunctionFragment;
    encodeFunctionData(functionFragment: "verify", values: [PromiseOrValue<BytesLike>, PromiseOrValue<BytesLike>]): string;
    decodeFunctionResult(functionFragment: "verify", data: BytesLike): Result;
    events: {};
}
export interface SHA256Digest extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;
    interface: SHA256DigestInterface;
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
         * Verifies a cryptographic hash.
         * @param data The data to hash.
         * @param hash The hash to compare to.
         */
        verify(data: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<[boolean]>;
    };
    /**
     * Verifies a cryptographic hash.
     * @param data The data to hash.
     * @param hash The hash to compare to.
     */
    verify(data: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    callStatic: {
        /**
         * Verifies a cryptographic hash.
         * @param data The data to hash.
         * @param hash The hash to compare to.
         */
        verify(data: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<boolean>;
    };
    filters: {};
    estimateGas: {
        /**
         * Verifies a cryptographic hash.
         * @param data The data to hash.
         * @param hash The hash to compare to.
         */
        verify(data: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<BigNumber>;
    };
    populateTransaction: {
        /**
         * Verifies a cryptographic hash.
         * @param data The data to hash.
         * @param hash The hash to compare to.
         */
        verify(data: PromiseOrValue<BytesLike>, hash: PromiseOrValue<BytesLike>, overrides?: CallOverrides): Promise<PopulatedTransaction>;
    };
}
