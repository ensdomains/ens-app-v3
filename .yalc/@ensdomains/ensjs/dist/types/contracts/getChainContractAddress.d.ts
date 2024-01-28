import type { ChainWithEns } from './consts.js';
type ChainClient<TChain extends ChainWithEns> = {
    chain: TChain;
};
export declare const getChainContractAddress: <TChain extends ChainWithEns, TClient extends ChainClient<TChain>>({ blockNumber, client, contract, }: {
    blockNumber?: bigint | undefined;
    client: TClient;
    contract: Extract<keyof TChain["contracts"], string>;
}) => `0x${string}`;
export {};
//# sourceMappingURL=getChainContractAddress.d.ts.map