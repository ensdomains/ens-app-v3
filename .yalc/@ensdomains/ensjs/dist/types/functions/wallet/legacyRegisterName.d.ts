import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type LegacyRegistrationParameters } from '../../utils/legacyRegisterHelpers.js';
export type LegacyRegisterNameDataParameters = LegacyRegistrationParameters & {
    /** Value of registration */
    value: bigint;
};
export type LegacyRegisterNameDataReturnType = SimpleTransactionRequest & {
    value: bigint;
};
export type LegacyRegisterNameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<LegacyRegisterNameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type LegacyRegisterNameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { value, ...args }: LegacyRegisterNameDataParameters) => LegacyRegisterNameDataReturnType;
/**
 * Registers a name on ENS
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link RegisterNameParameters}
 * @returns Transaction hash. {@link LegacyRegisterNameReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 * import { randomSecret } from '@ensdomains/ensjs/utils'
 * import { commitName, registerName } from '@ensdomains/ensjs/wallet'
 *
 * const mainnetWithEns = addEnsContracts(mainnet)
 * const client = createPublicClient({
 *   chain: mainnetWithEns,
 *   transport: http(),
 * })
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const secret = randomSecret()
 * const params = {
 *   name: 'example.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   duration: 31536000, // 1 year
 *   secret,
 * }
 *
 * const commitmentHash = await commitName(wallet, params)
 * await client.waitForTransactionReceipt({ hash: commitmentHash }) // wait for commitment to finalise
 * await new Promise((resolve) => setTimeout(resolve, 60 * 1_000)) // wait for commitment to be valid
 *
 * const { base, premium } = await getPrice(client, { nameOrNames: params.name, duration: params.duration })
 * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
 * const hash = await registerName(wallet, { ...params, value })
 * // 0x...
 */
declare function legacyRegisterName<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, owner, duration, secret, resolverAddress, address, value, ...txArgs }: LegacyRegisterNameParameters<TChain, TAccount, TChainOverride>): Promise<LegacyRegisterNameReturnType>;
declare namespace legacyRegisterName {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { value, ...args }: LegacyRegisterNameDataParameters) => LegacyRegisterNameDataReturnType;
}
export default legacyRegisterName;
//# sourceMappingURL=legacyRegisterName.d.ts.map