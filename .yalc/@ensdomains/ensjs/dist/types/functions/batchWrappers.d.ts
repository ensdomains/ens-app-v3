import type { TransactionRequest } from '@ethersproject/providers';
import { ENSArgs } from '..';
export declare const universalWrapper: {
    raw: ({ contracts }: ENSArgs<'contracts'>, name: string, data: string) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<{
        data: any;
        resolver: any;
    } | undefined>;
};
export declare const resolverMulticallWrapper: {
    raw: ({ contracts }: ENSArgs<'contracts'>, data: {
        to: string;
        data: string;
    }[]) => Promise<{
        to: string;
        data: string;
    }>;
    decode: ({ contracts }: ENSArgs<'contracts'>, data: string) => Promise<import("@ethersproject/abi").Result | undefined>;
};
export declare const multicallWrapper: {
    raw({ contracts }: ENSArgs<'contracts'>, transactions: TransactionRequest[], requireSuccess?: boolean): Promise<{
        to: string;
        data: string;
    }>;
    decode({ contracts, provider }: ENSArgs<'contracts' | 'provider'>, data: string, transactions: TransactionRequest[]): Promise<{
        success: boolean;
        returnData: string;
        0: boolean;
        1: string;
        length: 2;
        toString(): string;
        toLocaleString(): string;
        pop(): string | boolean | undefined;
        push(...items: (string | boolean)[]): number;
        concat(...items: ConcatArray<string | boolean>[]): (string | boolean)[];
        concat(...items: (string | boolean | ConcatArray<string | boolean>)[]): (string | boolean)[];
        join(separator?: string | undefined): string;
        reverse(): (string | boolean)[];
        shift(): string | boolean | undefined;
        slice(start?: number | undefined, end?: number | undefined): (string | boolean)[];
        sort(compareFn?: ((a: string | boolean, b: string | boolean) => number) | undefined): [boolean, string];
        splice(start: number, deleteCount?: number | undefined): (string | boolean)[];
        splice(start: number, deleteCount: number, ...items: (string | boolean)[]): (string | boolean)[];
        unshift(...items: (string | boolean)[]): number;
        indexOf(searchElement: string | boolean, fromIndex?: number | undefined): number;
        lastIndexOf(searchElement: string | boolean, fromIndex?: number | undefined): number;
        every<S extends string | boolean>(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => value is S, thisArg?: any): this is S[];
        every(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => unknown, thisArg?: any): boolean;
        some(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => unknown, thisArg?: any): boolean;
        forEach(callbackfn: (value: string | boolean, index: number, array: (string | boolean)[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: string | boolean, index: number, array: (string | boolean)[]) => U, thisArg?: any): U[];
        filter<S_1 extends string | boolean>(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => value is S_1, thisArg?: any): S_1[];
        filter(predicate: (value: string | boolean, index: number, array: (string | boolean)[]) => unknown, thisArg?: any): (string | boolean)[];
        reduce(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean): string | boolean;
        reduce(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean, initialValue: string | boolean): string | boolean;
        reduce<U_1>(callbackfn: (previousValue: U_1, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => U_1, initialValue: U_1): U_1;
        reduceRight(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean): string | boolean;
        reduceRight(callbackfn: (previousValue: string | boolean, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => string | boolean, initialValue: string | boolean): string | boolean;
        reduceRight<U_2>(callbackfn: (previousValue: U_2, currentValue: string | boolean, currentIndex: number, array: (string | boolean)[]) => U_2, initialValue: U_2): U_2;
        find<S_2 extends string | boolean>(predicate: (this: void, value: string | boolean, index: number, obj: (string | boolean)[]) => value is S_2, thisArg?: any): S_2 | undefined;
        find(predicate: (value: string | boolean, index: number, obj: (string | boolean)[]) => unknown, thisArg?: any): string | boolean | undefined;
        findIndex(predicate: (value: string | boolean, index: number, obj: (string | boolean)[]) => unknown, thisArg?: any): number;
        fill(value: string | boolean, start?: number | undefined, end?: number | undefined): [boolean, string];
        copyWithin(target: number, start: number, end?: number | undefined): [boolean, string];
        entries(): IterableIterator<[number, string | boolean]>;
        keys(): IterableIterator<number>;
        values(): IterableIterator<string | boolean>;
        includes(searchElement: string | boolean, fromIndex?: number | undefined): boolean;
        flatMap<U_3, This = undefined>(callback: (this: This, value: string | boolean, index: number, array: (string | boolean)[]) => U_3 | readonly U_3[], thisArg?: This | undefined): U_3[];
        flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[];
        [Symbol.iterator](): IterableIterator<string | boolean>;
        [Symbol.unscopables](): {
            copyWithin: boolean;
            entries: boolean;
            fill: boolean;
            find: boolean;
            findIndex: boolean;
            keys: boolean;
            values: boolean;
        };
        at(index: number): string | boolean | undefined;
    }[] | undefined>;
};
