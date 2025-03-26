import clearRecords, {} from '../../functions/wallet/clearRecords.js';
import commitName, {} from '../../functions/wallet/commitName.js';
import createSubname, {} from '../../functions/wallet/createSubname.js';
import deleteSubname, {} from '../../functions/wallet/deleteSubname.js';
import registerName, {} from '../../functions/wallet/registerName.js';
import renewNames, {} from '../../functions/wallet/renewNames.js';
import setAbiRecord, {} from '../../functions/wallet/setAbiRecord.js';
import setAddressRecord, {} from '../../functions/wallet/setAddressRecord.js';
import setChildFuses, {} from '../../functions/wallet/setChildFuses.js';
import setContentHashRecord, {} from '../../functions/wallet/setContentHashRecord.js';
import setFuses, {} from '../../functions/wallet/setFuses.js';
import setPrimaryName, {} from '../../functions/wallet/setPrimaryName.js';
import setRecords, {} from '../../functions/wallet/setRecords.js';
import setResolver, {} from '../../functions/wallet/setResolver.js';
import setTextRecord, {} from '../../functions/wallet/setTextRecord.js';
import transferName, {} from '../../functions/wallet/transferName.js';
import unwrapName, {} from '../../functions/wallet/unwrapName.js';
import wrapName, {} from '../../functions/wallet/wrapName.js';
/**
 * Extends the viem client with ENS wallet actions
 * @param client - The viem {@link WalletClient} object to add the ENS wallet actions to
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensWalletActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * }).extend(ensWalletActions)
 */
export const ensWalletActions = (client) => ({
    clearRecords: (parameters) => clearRecords(client, parameters),
    commitName: (parameters) => commitName(client, parameters),
    createSubname: (parameters) => createSubname(client, parameters),
    deleteSubname: (parameters) => deleteSubname(client, parameters),
    registerName: (parameters) => registerName(client, parameters),
    renewNames: (parameters) => renewNames(client, parameters),
    setAbiRecord: (parameters) => setAbiRecord(client, parameters),
    setAddressRecord: (parameters) => setAddressRecord(client, parameters),
    setChildFuses: (parameters) => setChildFuses(client, parameters),
    setContentHashRecord: (parameters) => setContentHashRecord(client, parameters),
    setFuses: (parameters) => setFuses(client, parameters),
    setPrimaryName: (parameters) => setPrimaryName(client, parameters),
    setRecords: (parameters) => setRecords(client, parameters),
    setResolver: (parameters) => setResolver(client, parameters),
    setTextRecord: (parameters) => setTextRecord(client, parameters),
    transferName: (parameters) => transferName(client, parameters),
    unwrapName: (parameters) => unwrapName(client, parameters),
    wrapName: (parameters) => wrapName(client, parameters),
});
//# sourceMappingURL=wallet.js.map