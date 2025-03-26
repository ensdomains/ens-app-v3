import {
  encodeFunctionData,
  type Account,
  type Address,
  type Hash,
  type SendTransactionParameters,
  type Transport,
} from 'viem'
import { sendTransaction } from 'viem/actions'
import type {
  ChainWithEns,
  ClientWithAccount,
  ClientWithEns,
} from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { nameWrapperSetSubnodeRecordSnippet } from '../../contracts/nameWrapper.js'
import { registrySetSubnodeRecordSnippet } from '../../contracts/registry.js'
import {
  InvalidContractTypeError,
  UnsupportedNameTypeError,
} from '../../errors/general.js'
import type {
  AnyDate,
  Prettify,
  SimpleTransactionRequest,
  WriteTransactionParameters,
} from '../../types.js'
import {
  encodeFuses,
  ParentFuses,
  type EncodeFusesInputObject,
} from '../../utils/fuses.js'
import { getNameType } from '../../utils/getNameType.js'
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent.js'
import {
  expiryToBigInt,
  wrappedLabelLengthCheck,
  makeDefaultExpiry,
} from '../../utils/wrapper.js'
import getWrapperData from '../public/getWrapperData.js'
import { BaseError } from '../../errors/base.js'

type BaseCreateSubnameDataParameters = {
  /** Subname to create */
  name: string
  /** New owner of subname */
  owner: Address
  /** Contract to create subname on */
  contract: 'registry' | 'nameWrapper'
  /** Resolver address to set */
  resolverAddress?: Address
  /** Expiry to set (only on NameWrapper) */
  expiry?: AnyDate
  /** Fuses to set (only on NameWrapper) */
  fuses?: EncodeFusesInputObject
}

type RegistryCreateSubnameDataParameters = {
  contract: 'registry'
  expiry?: never
  fuses?: never
}

type NameWrapperCreateSubnameDataParameters = {
  contract: 'nameWrapper'
  expiry?: AnyDate
  fuses?: EncodeFusesInputObject
}

export type CreateSubnameDataParameters = BaseCreateSubnameDataParameters &
  (RegistryCreateSubnameDataParameters | NameWrapperCreateSubnameDataParameters)

export type CreateSubnameDataReturnType = SimpleTransactionRequest

export type CreateSubnameParameters<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined,
> = Prettify<
  CreateSubnameDataParameters &
    WriteTransactionParameters<TChain, TAccount, TChainOverride>
>

export type CreateSubnameReturnType = Hash

export const makeFunctionData = <
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    contract,
    owner,
    resolverAddress = getChainContractAddress({
      client: wallet,
      contract: 'ensPublicResolver',
    }),
    expiry,
    fuses,
  }: CreateSubnameDataParameters,
): CreateSubnameDataReturnType => {
  const nameType = getNameType(name)
  if (nameType === 'tld' || nameType === 'root')
    throw new UnsupportedNameTypeError({
      nameType,
      supportedNameTypes: [
        'eth-2ld',
        'eth-subname',
        'other-2ld',
        'other-subname',
      ],
    })

  const { label, labelhash, parentNode } = makeLabelNodeAndParent(name)

  switch (contract) {
    case 'registry': {
      return {
        to: getChainContractAddress({
          client: wallet,
          contract: 'ensRegistry',
        }),
        data: encodeFunctionData({
          abi: registrySetSubnodeRecordSnippet,
          functionName: 'setSubnodeRecord',
          args: [parentNode, labelhash, owner, resolverAddress, BigInt(0)],
        }),
      }
    }
    case 'nameWrapper': {
      wrappedLabelLengthCheck(label)
      const generatedFuses = fuses ? encodeFuses({ input: fuses }) : 0
      const generatedExpiry = expiry
        ? expiryToBigInt(expiry)
        : makeDefaultExpiry(generatedFuses)
      return {
        to: getChainContractAddress({
          client: wallet,
          contract: 'ensNameWrapper',
        }),
        data: encodeFunctionData({
          abi: nameWrapperSetSubnodeRecordSnippet,
          functionName: 'setSubnodeRecord',
          args: [
            parentNode,
            label,
            owner,
            resolverAddress,
            BigInt(0),
            generatedFuses,
            generatedExpiry,
          ],
        }),
      }
    }
    default:
      throw new InvalidContractTypeError({
        contractType: contract,
        supportedContractTypes: ['registry', 'nameWrapper'],
      })
  }
}

class CreateSubnamePermissionDeniedError extends BaseError {
  parentName: string

  override name = 'CreateSubnamePermissionDeniedError'

  constructor({ parentName }: { parentName: string }) {
    super(
      `Create subname error: ${parentName} as burned CANNOT_CREATE_SUBDOMAIN fuse`,
    )
    this.parentName = parentName
  }
}

class CreateSubnameParentNotLockedError extends BaseError {
  parentName: string

  override name = 'CreateSubnameParentNotLockedError'

  constructor({ parentName }: { parentName: string }) {
    super(
      `Create subname error: Cannot burn PARENT_CANNOT_CONTROL when ${parentName} has not burned CANNOT_UNWRAP fuse`,
    )
    this.parentName = parentName
  }
}

const checkCanCreateSubname = async (
  wallet: ClientWithEns,
  {
    name,
    fuses,
    contract,
  }: Pick<BaseCreateSubnameDataParameters, 'name' | 'contract' | 'fuses'>,
): Promise<void> => {
  if (contract !== 'nameWrapper') return

  const parentName = name.split('.').slice(1).join('.')
  if (parentName === 'eth') return

  const parentWrapperData = await getWrapperData(wallet, { name: parentName })
  if (parentWrapperData?.fuses?.child?.CANNOT_CREATE_SUBDOMAIN)
    throw new CreateSubnamePermissionDeniedError({ parentName })

  const generatedFuses = fuses ? encodeFuses({ input: fuses }) : 0
  const isBurningPCC =
    fuses && BigInt(generatedFuses) & ParentFuses.PARENT_CANNOT_CONTROL
  const isParentCannotUnwrapBurned =
    parentWrapperData?.fuses?.child?.CANNOT_UNWRAP
  if (isBurningPCC && !isParentCannotUnwrapBurned)
    throw new CreateSubnameParentNotLockedError({ parentName })
}

/**
 * Creates a subname
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link CreateSubnameParameters}
 * @returns Transaction hash. {@link CreateSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { createSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await createSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   contract: 'registry',
 * })
 * // 0x...
 */
async function createSubname<
  TChain extends ChainWithEns,
  TAccount extends Account | undefined,
  TChainOverride extends ChainWithEns | undefined = ChainWithEns,
>(
  wallet: ClientWithAccount<Transport, TChain, TAccount>,
  {
    name,
    contract,
    owner,
    resolverAddress,
    expiry,
    fuses,
    ...txArgs
  }: CreateSubnameParameters<TChain, TAccount, TChainOverride>,
): Promise<CreateSubnameReturnType> {
  await checkCanCreateSubname(wallet, { name, fuses, contract })

  const data = makeFunctionData(wallet, {
    name,
    contract,
    owner,
    resolverAddress,
    expiry,
    fuses,
  } as CreateSubnameDataParameters)
  const writeArgs = {
    ...data,
    ...txArgs,
  } as SendTransactionParameters<TChain, TAccount, TChainOverride>

  return sendTransaction(wallet, writeArgs)
}

createSubname.makeFunctionData = makeFunctionData

export default createSubname
