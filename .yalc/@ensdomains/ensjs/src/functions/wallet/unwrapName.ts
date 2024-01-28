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
import {
  nameWrapperUnwrapEth2ldSnippet,
  nameWrapperUnwrapSnippet,
} from '../../contracts/nameWrapper.js'
import {
  AdditionalParameterSpecifiedError,
  RequiredParameterNotSpecifiedError,
} from '../../errors/general.js'
import type {
  Eth2ldName,
  Eth2ldNameSpecifier,
  GetNameType,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import { getNameType } from '../../utils/getNameType.js'
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent.js'

type BaseUnwrapNameDataParameters<TName extends string> = {
  /** The name to unwrap */
  name: TName
  /** The recipient of the unwrapped name */
  newOwnerAddress: Address
  /** The registrant of the unwrapped name (eth-2ld only) */
  newRegistrantAddress?: Address
}

type Eth2ldUnwrapNameDataParameters = {
  name: Eth2ldName
  newRegistrantAddress: Address
}

type OtherUnwrapNameDataParameters = {
  name: string
  newRegistrantAddress?: never
}

export type UnwrapNameDataParameters<
  TName extends string,
  TNameType extends GetNameType<TName> = GetNameType<TName>,
> = BaseUnwrapNameDataParameters<TName> &
  (TNameType extends Eth2ldNameSpecifier
    ? Eth2ldUnwrapNameDataParameters
    : OtherUnwrapNameDataParameters)

export type UnwrapNameDataReturnType = SimpleTransactionRequest

export type UnwrapNameParameters<
  TName extends string,
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = UnwrapNameDataParameters<TName> &
  WriteTransactionParameters<TChain, TAccount, TChainOverride>

export type UnwrapNameReturnType = Hash

export const makeFunctionData = <
  TName extends string,
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    name,
    newOwnerAddress,
    newRegistrantAddress,
  }: UnwrapNameDataParameters<TName>,
): UnwrapNameDataReturnType => {
  const { labelhash, parentNode } = makeLabelNodeAndParent(name)
  const nameWrapperAddress = getChainContractAddress({
    client: wallet,
    contract: 'ensNameWrapper',
  })
  const nameType = getNameType(name)

  if (nameType === 'eth-2ld') {
    if (!newRegistrantAddress)
      throw new RequiredParameterNotSpecifiedError({
        parameter: 'newRegistrantAddress',
        details: 'Must provide newRegistrantAddress for eth-2ld names',
      })

    return {
      to: nameWrapperAddress,
      data: encodeFunctionData({
        abi: nameWrapperUnwrapEth2ldSnippet,
        functionName: 'unwrapETH2LD',
        args: [labelhash, newRegistrantAddress, newOwnerAddress],
      }),
    }
  }

  if (newRegistrantAddress)
    throw new AdditionalParameterSpecifiedError({
      parameter: 'newRegistrantAddress',
      allowedParameters: ['name', 'newOwnerAddress'],
      details: 'newRegistrantAddress can only be specified for eth-2ld names',
    })

  return {
    to: nameWrapperAddress,
    data: encodeFunctionData({
      abi: nameWrapperUnwrapSnippet,
      functionName: 'unwrap',
      args: [parentNode, labelhash, newOwnerAddress],
    }),
  }
}

/**
 * Unwraps a name.
 * @param wallet - {@link WalletWithEns}
 * @param parameters - {@link UnwrapNameParameters}
 * @returns Transaction hash. {@link UnwrapNameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { unwrapName } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await unwrapName(wallet, {
 *   name: 'example.eth',
 *   newOwnerAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   newRegistrantAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 * })
 * // 0x...
 */
async function unwrapName<
  TName extends string,
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: WalletWithEns<Transport, TChain, TAccount>,
  {
    name,
    newOwnerAddress,
    newRegistrantAddress,
    ...txArgs
  }: UnwrapNameParameters<TName, TChain, TAccount, TChainOverride>,
): Promise<UnwrapNameReturnType> {
  const data = makeFunctionData(wallet, {
    name,
    newOwnerAddress,
    newRegistrantAddress,
  } as UnwrapNameDataParameters<TName>)
  const writeArgs = {
    ...data,
    ...(txArgs as WriteTransactionParameters<TChain, TAccount, TChainOverride>),
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>
  return wallet.sendTransaction(writeArgs)
}

unwrapName.makeFunctionData = makeFunctionData

export default unwrapName
