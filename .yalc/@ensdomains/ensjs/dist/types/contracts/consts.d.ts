import type { Account, Address, Chain, Client, Transport, WalletClient } from 'viem';
type ChainContract = {
    address: Address;
    blockCreated?: number;
};
export declare const supportedChains: readonly ["homestead", "goerli", "sepolia"];
export declare const supportedContracts: readonly ["ensBaseRegistrarImplementation", "ensDnsRegistrar", "ensEthRegistrarController", "ensNameWrapper", "ensPublicResolver", "ensReverseRegistrar", "ensBulkRenewal", "ensDnssecImpl", "ensUniversalResolver", "ensRegistry"];
export type SupportedChain = (typeof supportedChains)[number];
export type SupportedContract = (typeof supportedContracts)[number];
export declare const addresses: {
    readonly homestead: {
        readonly ensRegistry: {
            readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        };
        readonly ensBaseRegistrarImplementation: {
            readonly address: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";
        };
        readonly ensDnsRegistrar: {
            readonly address: "0x58774Bb8acD458A640aF0B88238369A167546ef2";
        };
        readonly ensEthRegistrarController: {
            readonly address: "0x253553366Da8546fC250F225fe3d25d0C782303b";
        };
        readonly ensNameWrapper: {
            readonly address: "0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401";
        };
        readonly ensPublicResolver: {
            readonly address: "0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63";
        };
        readonly ensReverseRegistrar: {
            readonly address: "0xa58E81fe9b61B5c3fE2AFD33CF304c454AbFc7Cb";
        };
        readonly ensBulkRenewal: {
            readonly address: "0xa12159e5131b1eEf6B4857EEE3e1954744b5033A";
        };
        readonly ensDnssecImpl: {
            readonly address: "0x21745FF62108968fBf5aB1E07961CC0FCBeB2364";
        };
        readonly ensUniversalResolver: {
            readonly address: "0x8cab227b1162f03b8338331adaad7aadc83b895e";
        };
    };
    readonly goerli: {
        readonly ensRegistry: {
            readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        };
        readonly ensBaseRegistrarImplementation: {
            readonly address: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";
        };
        readonly ensDnsRegistrar: {
            readonly address: "0x8edc487D26F6c8Fa76e032066A3D4F87E273515d";
        };
        readonly ensEthRegistrarController: {
            readonly address: "0xCc5e7dB10E65EED1BBD105359e7268aa660f6734";
        };
        readonly ensNameWrapper: {
            readonly address: "0x114D4603199df73e7D157787f8778E21fCd13066";
        };
        readonly ensPublicResolver: {
            readonly address: "0xd7a4F6473f32aC2Af804B3686AE8F1932bC35750";
        };
        readonly ensReverseRegistrar: {
            readonly address: "0x6d9F26FfBcF1c6f0bAe9F2C1f7fBe8eE6B1d8d4d";
        };
        readonly ensBulkRenewal: {
            readonly address: "0x6d9F26FfBcF1c6f0bAe9F2C1f7fBe8eE6B1d8d4d";
        };
        readonly ensDnssecImpl: {
            readonly address: "0xF427c4AdED8B6dfde604865c1a7E953B160C26f0";
        };
        readonly ensUniversalResolver: {
            readonly address: "0xfc4AC75C46C914aF5892d6d3eFFcebD7917293F1";
        };
    };
    readonly sepolia: {
        readonly ensRegistry: {
            readonly address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        };
        readonly ensBaseRegistrarImplementation: {
            readonly address: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";
        };
        readonly ensDnsRegistrar: {
            readonly address: "0x537625B0D7901FD20C57850d61580Bf1624Ef146";
        };
        readonly ensEthRegistrarController: {
            readonly address: "0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72";
        };
        readonly ensNameWrapper: {
            readonly address: "0x0635513f179D50A207757E05759CbD106d7dFcE8";
        };
        readonly ensPublicResolver: {
            readonly address: "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";
        };
        readonly ensReverseRegistrar: {
            readonly address: "0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6";
        };
        readonly ensBulkRenewal: {
            readonly address: "0x4EF77b90762Eddb33C8Eba5B5a19558DaE53D7a1";
        };
        readonly ensDnssecImpl: {
            readonly address: "0x7b3ada1c8f012bae747cf99d6cbbf70d040b84cf";
        };
        readonly ensUniversalResolver: {
            readonly address: "0xBaBC7678D7A63104f1658c11D6AE9A21cdA09725";
        };
    };
};
type Subgraphs = {
    ens: {
        url: string;
    };
};
export declare const subgraphs: {
    readonly homestead: {
        readonly ens: {
            readonly url: "https://api.thegraph.com/subgraphs/name/ensdomains/ens";
        };
    };
    readonly goerli: {
        readonly ens: {
            readonly url: "https://api.thegraph.com/subgraphs/name/ensdomains/ensgoerli";
        };
    };
    readonly sepolia: {
        readonly ens: {
            readonly url: "https://api.studio.thegraph.com/query/49574/enssepolia/version/latest";
        };
    };
};
type EnsChainContracts = {
    ensBaseRegistrarImplementation: ChainContract;
    ensDnsRegistrar: ChainContract;
    ensEthRegistrarController: ChainContract;
    ensNameWrapper: ChainContract;
    ensPublicResolver: ChainContract;
    ensReverseRegistrar: ChainContract;
    ensBulkRenewal: ChainContract;
    ensDnssecImpl: ChainContract;
};
type BaseChainContracts = {
    multicall3: ChainContract;
    ensUniversalResolver: ChainContract;
    ensRegistry: ChainContract;
};
export type ChainWithEns<TChain extends Chain = Chain> = TChain & {
    contracts: BaseChainContracts & EnsChainContracts;
    subgraphs: Subgraphs;
};
export type CheckedChainWithEns<TChain extends Chain> = TChain['network'] extends SupportedChain ? TChain & {
    contracts: (typeof addresses)[TChain['network']];
    subgraphs: (typeof subgraphs)[TChain['network']];
} : never;
export type ClientWithEns<TTransport extends Transport = Transport, TChain extends ChainWithEns = ChainWithEns> = Client<TTransport, TChain>;
export type WalletWithEns<TTransport extends Transport = Transport, TChain extends ChainWithEns = ChainWithEns, TAccount extends Account | undefined = Account | undefined> = WalletClient<TTransport, TChain, TAccount>;
export {};
//# sourceMappingURL=consts.d.ts.map