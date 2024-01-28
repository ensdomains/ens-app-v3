import type { ClientWithEns } from '../contracts/consts.js';
import type { TransactionRequestWithPassthrough } from '../types.js';
export type EncoderFunction = (...args: any[]) => TransactionRequestWithPassthrough;
export type DecoderFunction = (...args: any[]) => Promise<any>;
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export type CoderObject<TEncoderFn extends EncoderFunction = EncoderFunction, TDecoderFn extends DecoderFunction = DecoderFunction> = {
    encode: TEncoderFn;
    decode: TDecoderFn;
};
export type BatchFunctionResult<TEncoderFn extends EncoderFunction = EncoderFunction, TDecoderFn extends DecoderFunction = DecoderFunction> = {
    args: Parameters<OmitFirstArg<TEncoderFn>>;
} & CoderObject<TEncoderFn, TDecoderFn>;
export type ExtractResult<TFunction extends Function> = TFunction extends (...args: any[]) => Promise<infer U> ? U : never;
export interface GeneratedFunction<TEncoderFn extends EncoderFunction, TDecoderFn extends DecoderFunction> extends Function, CoderObject<TEncoderFn, TDecoderFn> {
    (client: ClientWithEns, ...args: Parameters<OmitFirstArg<TEncoderFn>>): Promise<ExtractResult<TDecoderFn> | null>;
    batch: (...args: Parameters<OmitFirstArg<TEncoderFn>>) => BatchFunctionResult<TEncoderFn, TDecoderFn>;
}
export declare const generateFunction: <TEncoderFn extends EncoderFunction, TDecoderFn extends DecoderFunction, TFunction extends GeneratedFunction<TEncoderFn, TDecoderFn> = GeneratedFunction<TEncoderFn, TDecoderFn>>({ encode, decode, }: {
    encode: TEncoderFn;
    decode: TDecoderFn;
}) => TFunction;
export {};
//# sourceMappingURL=generateFunction.d.ts.map