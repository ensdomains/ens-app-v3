import { ccipRequest as viemCcipRequest, type CcipRequestParameters, type Chain } from 'viem';
export declare const ccipRequest: <TChain extends Chain>(chain: TChain) => ({ data, sender, urls, }: CcipRequestParameters) => ReturnType<typeof viemCcipRequest>;
//# sourceMappingURL=ccipRequest.d.ts.map