import type { Chain } from 'viem';
type ExtractContract<TClient> = TClient extends {
    chain: {
        contracts: infer C;
    };
} ? C extends Record<string, {
    address: string;
}> ? C : never : never;
export declare const getChainContractAddress: <const TClient extends {
    chain: Chain;
}, TContracts extends ExtractContract<TClient> = ExtractContract<TClient>, TContractName extends keyof TContracts = keyof TContracts, TContract extends TContracts[TContractName] = TContracts[TContractName]>({ blockNumber, client, contract, }: {
    blockNumber?: bigint | undefined;
    client: TClient;
    contract: TContractName;
}) => TContract extends {
    address: infer A;
} ? A extends `0x${string}` ? A : never : `0x${string}`;
export {};
//# sourceMappingURL=getChainContractAddress.d.ts.map