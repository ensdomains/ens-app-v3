import { type Coin } from '@ensdomains/address-encoder';
export declare const normaliseCoinId: (coinId: string | number) => {
    readonly type: "name";
    readonly value: string;
} | {
    readonly type: "id";
    readonly value: number;
};
export declare const getCoderFromCoin: (coinId: string | number) => Coin;
//# sourceMappingURL=normaliseCoinId.d.ts.map