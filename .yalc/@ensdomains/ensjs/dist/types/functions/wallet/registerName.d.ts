import { type Account, type Hash, type Transport } from 'viem';
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js';
import type { Prettify, SimpleTransactionRequest, WriteTransactionParameters } from '../../types.js';
import { type RegistrationParameters } from '../../utils/registerHelpers.js';
export type RegisterNameDataParameters = RegistrationParameters & {
    /** Value of registration */
    value: bigint;
};
export type RegisterNameDataReturnType = SimpleTransactionRequest & {
    value: bigint;
};
export type RegisterNameParameters<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined> = Prettify<RegisterNameDataParameters & WriteTransactionParameters<TChain, TAccount, TChainOverride>>;
export type RegisterNameReturnType = Hash;
export declare const makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { value, ...args }: RegisterNameDataParameters) => RegisterNameDataReturnType;
/**
 * Registers a name on ENS
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link RegisterNameParameters}
 * @returns Transaction hash. {@link RegisterNameReturnType}
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
declare function registerName<TChain extends ChainWithEns, TAccount extends Account | undefined, TChainOverride extends ChainWithEns | undefined = ChainWithEns>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, value, ...txArgs }: RegisterNameParameters<TChain, TAccount, TChainOverride>): Promise<RegisterNameReturnType>;
declare namespace registerName {
    var makeFunctionData: <TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: ClientWithAccount<Transport, TChain, TAccount>, { value, ...args }: RegisterNameDataParameters) => RegisterNameDataReturnType;
}
export default registerName;
//# sourceMappingURL=registerName.d.ts.map