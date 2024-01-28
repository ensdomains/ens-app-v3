import {
  encodeFunctionData,
  type Account,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { bulkRenewalRenewAllSnippet } from '../../contracts/bulkRenewal.js'
import type { ChainWithEns, WalletWithEns } from '../../contracts/consts.js'
import { ethRegistrarControllerRenewSnippet } from '../../contracts/ethRegistrarController.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { UnsupportedNameTypeError } from '../../errors/general.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { getNameType } from '../../utils/getNameType.js'

export type RenewNamesDataParameters = {
  /** Name or names to renew */
  nameOrNames: string | string[]
  /** Duration to renew name(s) for */
  duration: bigint | number
  /** Value of all renewals */
  value: bigint
}

export type RenewNamesDataReturnType = SimpleTransactionRequest & {
  value: bigint
}

export type RenewNamesParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  RenewNamesDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type RenewNamesReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  { nameOrNames, duration, value }: RenewNamesDataParameters,
): RenewNamesDataReturnType => {
  const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]
  const labels = names.map((name) => {
    const label = name.split('.')
    const nameType = getNameType(name)
    if (nameType !== 'eth-2ld')
      throw new UnsupportedNameTypeError({
        nameType,
        supportedNameTypes: ['eth-2ld'],
        details: 'Only 2ld-eth renewals are currently supported',
      })
    return label[0]
  })

  if (labels.length === 1) {
    return {
      to: getChainContractAddress({
        client: wallet,
        contract: 'ensEthRegistrarController',
      }),
      data: encodeFunctionData({
        abi: ethRegistrarControllerRenewSnippet,
        functionName: 'renew',
        args: [labels[0], BigInt(duration)],
      }),
      value,
    }
  }

  return {
    to: getChainContractAddress({
      client: wallet,
      contract: 'ensBulkRenewal',
    }),
    data: encodeFunctionData({
      abi: bulkRenewalRenewAllSnippet,
      functionName: 'renewAll',
      args: [labels, BigInt(duration)],
    }),
    value,
  }
}

/**
 * Renews a name or names for a specified duration.
 * @param wallet - {@link WalletWithEns}
 * @param parameters - {@link RenewNamesParameters}
 * @returns Transaction hash. {@link RenewNamesReturnType}
 *
 * @example
 * import { createPublicClient, createWalletClient, http, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getPrice } from '@ensdomains/ensjs/public'
 * import { renewNames } from '@ensdomains/ensjs/wallet'
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
 *
 * const duration = 31536000 // 1 year
 * const { base, premium } = await getPrice(wallet, {
 *  nameOrNames: 'example.eth',
 *  duration,
 * })
 * const value = (base + premium) * 110n / 100n // add 10% to the price for buffer
 * const hash = await renewNames(wallet, {
 *   nameOrNames: 'example.eth',
 *   duration,
 *   value,
 * })
 * // 0x...
 */
async function renewNames<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    nameOrNames,
    duration,
    value,
    ...txArgs
  }: RenewNamesParameters<TChain, TAccount, TChainOverride>,
): Promise<RenewNamesReturnType> {
  const data = makeFunctionData(wallet, { nameOrNames, duration, value })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return wallet.sendTransaction(writeArgs)
}

renewNames.makeFunctionData = makeFunctionData

export default renewNames
