import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type LegacyRegistrationParameters } from '../../utils/legacyRegisterHelpers.js';
export type LegacyCommitNameDataParameters = LegacyRegistrationParameters;
export type LegacyCommitNameDataReturnType = SimpleTransactionRequest;
export type LegacyCommitNameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<LegacyCommitNameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type LegacyCommitNameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, args: LegacyCommitNameDataParameters) => LegacyCommitNameDataReturnType;
/**
 * Commits a name to be registered
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link LegacyCommitNameParameters}
 * @returns Transaction hash. {@link LegacyCommitNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { commitName } from '@ensdomains/ensjs/wallet'
 * import { randomSecret } from '@ensdomains/ensjs/utils'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const secret = randomSecret()
 * const hash = await commitName(wallet, {
 *   name: 'example.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   duration: 31536000, // 1 year
 *   secret,
 * })
 * // 0x...
 */
declare function legacyCommitName<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, owner, duration, secret, resolverAddress, address, ...txArgs }: LegacyCommitNameParameters<TChain, TAccount, TChainOverride>): Promise<LegacyCommitNameReturnType>;
declare namespace legacyCommitName {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, args: LegacyRegistrationParameters) => SimpleTransactionRequest;
}
export default legacyCommitName;
//# sourceMappingURL=legacyCommitName.d.ts.map