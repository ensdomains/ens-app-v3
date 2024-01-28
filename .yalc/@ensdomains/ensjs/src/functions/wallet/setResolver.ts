import {
  encodeFunctionData,
  type Account,
  type Address,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import type { ChainWithEns, WalletWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { nameWrapperSetResolverSnippet } from '../../contracts/nameWrapper.js'
import { registrySetResolverSnippet } from '../../contracts/registry.js'
import type {
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { namehash } from '../../utils/normalise.js'

export type SetResolverDataParameters = {
  /** Name to set resolver for */
  name: string
  /** Contract to set resolver on */
  contract: 'registry' | 'nameWrapper'
  /** Resolver address to set */
  resolverAddress: Address
}

export type SetResolverDataReturnType = SimpleTransactionRequest

export type SetResolverParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  SetResolverDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type SetResolverReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  { name, contract, resolverAddress }: SetResolverDataParameters,
): SetResolverDataReturnType => {
  if (contract !== 'registry' && contract !== 'nameWrapper')
    throw new Error(`Unknown contract: ${contract}`)

  const to = getChainContractAddress({
    client: wallet,
    contract: contract === 'nameWrapper' ? 'ensNameWrapper' : 'ensRegistry',
  })

  const args = [namehash(name), resolverAddress] as const
  const functionName = 'setResolver'

  if (contract === 'nameWrapper')
    return {
      to,
      data: encodeFunctionData({
        abi: nameWrapperSetResolverSnippet,
        functionName,
        args,
      }),
    }

  return {
    to,
    data: encodeFunctionData({
      abi: registrySetResolverSnippet,
      functionName,
      args,
    }),
  }
}

/**
 * Sets a resolver for a name.
 * @param wallet - {@link WalletWithEns}
 * @param parameters - {@link SetResolverParameters}
 * @returns Transaction hash. {@link SetResolverReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setResolver } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setResolver(wallet, {
 *   name: 'ens.eth',
 *   contract: 'registry',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setResolver<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    name,
    contract,
    resolverAddress,
    ...txArgs
  }: SetResolverParameters<TChain, TAccount, TChainOverride>,
): Promise<SetResolverReturnType> {
  const data = makeFunctionData(wallet, { name, contract, resolverAddress })
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return wallet.sendTransaction(writeArgs)
}

setResolver.makeFunctionData = makeFunctionData

export default setResolver
