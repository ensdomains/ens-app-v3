import {
  encodeFunctionData,
  type Account,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { sendTransaction } from 'viem/actions'
import type { ChainWithEns, ClientWithAccount } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { UnsupportedNameTypeError } from '../../errors/general.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { getNameType } from '../../utils/getNameType.js'
import {
  makeLegacyRegistrationTuple,
  type LegacyRegistrationParameters,
  isLegacyRegistrationWithConfigParameters,
  makeLegacyRegistrationWithConfigTuple,
} from '../../utils/legacyRegisterHelpers.js'
import {
  legacyEthRegistrarControllerRegisterSnippet,
  legacyEthRegistrarControllerRegisterWithConfigSnippet,
} from '../../contracts/legacyEthRegistrarController.js'

export type LegacyRegisterNameDataParameters = LegacyRegistrationParameters & {
  /** Value of registration */
  value: bigint
}

export type LegacyRegisterNameDataReturnType = SimpleTransactionRequest & {
  value: bigint
}

export type LegacyRegisterNameParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  LegacyRegisterNameDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type LegacyRegisterNameReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  { value, ...args }: LegacyRegisterNameDataParameters,
): LegacyRegisterNameDataReturnType => {
  const nameType = getNameType(args.name)
  if (nameType !== 'eth-2ld')
    throw new UnsupportedNameTypeError({
      nameType,
      supportedNameTypes: ['eth-2ld'],
      details: 'Only 2ld-eth name registration is supported',
    })

  return {
    to: getChainContractAddress({
      client: wallet,
      contract: 'legacyEthRegistrarController',
    }),
    data: isLegacyRegistrationWithConfigParameters(args)
      ? encodeFunctionData({
          abi: legacyEthRegistrarControllerRegisterWithConfigSnippet,
          functionName: 'registerWithConfig',
          args: makeLegacyRegistrationWithConfigTuple(args),
        })
      : encodeFunctionData({
          abi: legacyEthRegistrarControllerRegisterSnippet,
          functionName: 'register',
          args: makeLegacyRegistrationTuple(args),
        }),
    value,
  }
}

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
async function legacyRegisterName<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    owner,
    duration,
    secret,
    resolverAddress,
    address,
    value,
    ...txArgs
  }: LegacyRegisterNameParameters<TChain, TAccount, TChainOverride>,
): Promise<LegacyRegisterNameReturnType> {
  const data = makeFunctionData(wallet, {
    name,
    owner,
    duration,
    secret,
    resolverAddress,
    address,
    value,
  })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return sendTransaction(wallet, writeArgs)
}

legacyRegisterName.makeFunctionData = makeFunctionData

export default legacyRegisterName
