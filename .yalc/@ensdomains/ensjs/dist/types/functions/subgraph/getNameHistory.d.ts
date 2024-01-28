import type { ClientWithEns } from '../../contracts/consts.js';
import type { BaseResolverEvent, ContenthashChanged, DomainEvent, MulticoinAddrChanged, RegistrationEvent, ResolverEvent } from './events.js';
export type GetNameHistoryParameters = {
    /** Name to get history for */
    name: string;
};
type FlattenedEvent<TEvent extends {}> = {
    [K in keyof TEvent]: TEvent[K] extends {
        id: string;
    } ? string : TEvent[K];
};
type ReturnDomainEvent = FlattenedEvent<DomainEvent>;
type ReturnRegistrationEvent = FlattenedEvent<RegistrationEvent>;
type ReturnResolverEvent = FlattenedEvent<Exclude<ResolverEvent, MulticoinAddrChanged | ContenthashChanged> | (BaseResolverEvent & {
    type: 'MulticoinAddrChanged';
    coinType: string;
    coinName: string | null;
    decoded: boolean;
    addr: string | null;
}) | (BaseResolverEvent & {
    type: 'ContenthashChanged';
    decoded: boolean;
    contentHash: string | null;
    protocolType: string | null;
})>;
export type GetNameHistoryReturnType = {
    /** Array of domain events */
    domainEvents: ReturnDomainEvent[];
    /** Array of registration events */
    registrationEvents: ReturnRegistrationEvent[] | null;
    /** Array of resolver events */
    resolverEvents: ReturnResolverEvent[] | null;
} | null;
/**
 * Gets the history of a name from the subgraph.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetNameHistoryParameters}
 * @returns History object, or null if name could not be found. {@link GetNameHistoryReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getNameHistory } from '@ensdomains/ensjs/subgraph'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getNameHistory(client, { name: 'ens.eth' })
 */
declare const getNameHistory: (client: ClientWithEns, { name }: GetNameHistoryParameters) => Promise<GetNameHistoryReturnType>;
export default getNameHistory;
//# sourceMappingURL=getNameHistory.d.ts.map