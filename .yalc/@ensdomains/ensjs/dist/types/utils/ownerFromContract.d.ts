import { type Hex } from 'viem';
import type { ClientWithEns } from '../contracts/consts.js';
export type OwnerContract = 'nameWrapper' | 'registry' | 'registrar';
export type OwnerFromContractArgs = {
    client: ClientWithEns;
    contract: OwnerContract;
    namehash?: Hex;
    labels?: string[];
} & ({
    contract: Exclude<OwnerContract, 'registrar'>;
    namehash: Hex;
} | {
    contract: 'registrar';
    labels: string[];
});
export declare const ownerFromContract: ({ client, contract, namehash, labels, }: OwnerFromContractArgs) => {
    to: `0x${string}`;
    data: `0x${string}`;
};
//# sourceMappingURL=ownerFromContract.d.ts.map