import batch, {} from '../../functions/public/batch.js';
import getAbiRecord, {} from '../../functions/public/getAbiRecord.js';
import getAddressRecord, {} from '../../functions/public/getAddressRecord.js';
import getAvailable, {} from '../../functions/public/getAvailable.js';
import getContentHashRecord, {} from '../../functions/public/getContentHashRecord.js';
import getExpiry, {} from '../../functions/public/getExpiry.js';
import getName, {} from '../../functions/public/getName.js';
import getOwner, {} from '../../functions/public/getOwner.js';
import getPrice, {} from '../../functions/public/getPrice.js';
import getRecords, {} from '../../functions/public/getRecords.js';
import getResolver, {} from '../../functions/public/getResolver.js';
import getTextRecord, {} from '../../functions/public/getTextRecord.js';
import getWrapperData, {} from '../../functions/public/getWrapperData.js';
import getWrapperName, {} from '../../functions/public/getWrapperName.js';
/**
 * Extends the viem client with ENS public actions
 * @param client - The viem {@link Client} object to add the ENS public actions to
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensPublicActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * }).extend(ensPublicActions)
 */
export const ensPublicActions = (client) => ({
    ensBatch: (...parameters) => batch(client, ...parameters),
    getAbiRecord: (parameters) => getAbiRecord(client, parameters),
    getAddressRecord: (parameters) => getAddressRecord(client, parameters),
    getAvailable: (parameters) => getAvailable(client, parameters),
    getContentHashRecord: (parameters) => getContentHashRecord(client, parameters),
    getExpiry: (parameters) => getExpiry(client, parameters),
    getName: (parameters) => getName(client, parameters),
    getOwner: (parameters) => getOwner(client, parameters),
    getPrice: (parameters) => getPrice(client, parameters),
    getRecords: (parameters) => getRecords(client, parameters),
    getResolver: (parameters) => getResolver(client, parameters),
    getTextRecord: (parameters) => getTextRecord(client, parameters),
    getWrapperData: (parameters) => getWrapperData(client, parameters),
    getWrapperName: (parameters) => getWrapperName(client, parameters),
});
//# sourceMappingURL=public.js.map