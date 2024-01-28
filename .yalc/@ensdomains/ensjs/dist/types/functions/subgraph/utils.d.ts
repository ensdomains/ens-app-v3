import { type Address, type Hex } from 'viem';
import type { DateWithValue } from '../../types.js';
import { type DecodedFuses } from '../../utils/fuses.js';
import type { SubgraphDomain } from './fragments.js';
export type Name = {
    /** Id of the name, equal to namehash */
    id: Hex;
    /** Name string */
    name: string | null;
    /** Truncated name, formatted for display use only */
    truncatedName: string | null;
    /** Label name for name */
    labelName: string | null;
    /** Label hash of label for name */
    labelhash: Hex;
    /** Migration status from old ENS registry */
    isMigrated: boolean;
    /** Parent name string, null if name is root */
    parentName: string | null;
    /** Initial name creation time */
    createdAt: DateWithValue<number>;
    /** Registration date of name */
    registrationDate: DateWithValue<number> | null;
    /** Expiry date of name */
    expiryDate: DateWithValue<number> | null;
    /** Fuse values for name */
    fuses: DecodedFuses | null;
    /** Owner address */
    owner: Address;
    /** Registrant address */
    registrant: Address | null;
    /** Wrapped owner address */
    wrappedOwner: Address | null;
    /** ETH record on name */
    resolvedAddress: Address | null;
};
export declare const getChecksumAddressOrNull: (address: string | undefined) => Address | null;
export declare const makeNameObject: (domain: SubgraphDomain) => Name;
//# sourceMappingURL=utils.d.ts.map