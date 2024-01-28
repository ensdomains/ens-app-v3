import {
  BaseError,
  decodeFunctionResult,
  encodeFunctionData,
  labelhash,
  type Hex,
} from 'viem'
import {
  baseRegistrarGracePeriodSnippet,
  baseRegistrarNameExpiresSnippet,
} from '../../contracts/baseRegistrar.js'
import type { ClientWithEns } from '../../contracts/consts.js'
import { getChainContractAddress } from '../../contracts/getChainContractAddress.js'
import { multicallGetCurrentBlockTimestampSnippet } from '../../contracts/multicall.js'
import { nameWrapperGetDataSnippet } from '../../contracts/nameWrapper.js'
import type {
  DateWithValue,
  Prettify,
  SimpleTransactionRequest,
} from '../../types.js'
import {
  generateFunction,
  type GeneratedFunction,
} from '../../utils/generateFunction.js'
import { makeSafeSecondsDate } from '../../utils/makeSafeSecondsDate.js'
import { namehash } from '../../utils/normalise.js'
import { checkIsDotEth } from '../../utils/validation.js'
import multicallWrapper from './multicallWrapper.js'

type ContractOption = 'registrar' | 'nameWrapper'
type ExpiryStatus = 'active' | 'expired' | 'gracePeriod'

export type GetExpiryParameters = Prettify<{
  /** Name to get expiry for */
  name: string
  /** Optional specific contract to use to get expiry */
  contract?: ContractOption
}>

export type GetExpiryReturnType = Prettify<{
  /** Expiry value */
  expiry: DateWithValue<bigint>
  /** Grace period value (in seconds) */
  gracePeriod: number
  /** Status of name */
  status: ExpiryStatus
} | null>

const getContractToUse = (
  contract: ContractOption | undefined,
  labels: string[],
) => {
  if (contract) return contract
  if (checkIsDotEth(labels)) {
    return 'registrar'
  }
  return 'nameWrapper'
}

const encode = (
  client: ClientWithEns,
  { name, contract }: GetExpiryParameters,
): SimpleTransactionRequest => {
  const labels = name.split('.')

  const contractToUse = getContractToUse(contract, labels)

  const calls: SimpleTransactionRequest[] = [
    {
      to: getChainContractAddress({ client, contract: 'multicall3' }),
      data: encodeFunctionData({
        abi: multicallGetCurrentBlockTimestampSnippet,
        functionName: 'getCurrentBlockTimestamp',
      }),
    },
  ]

  if (contractToUse === 'nameWrapper') {
    calls.push({
      to: getChainContractAddress({ client, contract: 'ensNameWrapper' }),
      data: encodeFunctionData({
        abi: nameWrapperGetDataSnippet,
        functionName: 'getData',
        args: [BigInt(namehash(labels.join('.')))],
      }),
    })
  } else {
    const baseRegistrarImplementationAddress = getChainContractAddress({
      client,
      contract: 'ensBaseRegistrarImplementation',
    })
    calls.push({
      to: baseRegistrarImplementationAddress,
      data: encodeFunctionData({
        abi: baseRegistrarNameExpiresSnippet,
        functionName: 'nameExpires',
        args: [BigInt(labelhash(labels[0]))],
      }),
    })
    calls.push({
      to: baseRegistrarImplementationAddress,
      data: encodeFunctionData({
        abi: baseRegistrarGracePeriodSnippet,
        functionName: 'GRACE_PERIOD',
      }),
    })
  }

  return multicallWrapper.encode(client, { transactions: calls })
}

const decode = async (
  client: ClientWithEns,
  data: Hex | BaseError,
  { name, contract }: GetExpiryParameters,
): Promise<GetExpiryReturnType> => {
  if (typeof data === 'object') throw data
  const labels = name.split('.')
  const result = await multicallWrapper.decode(client, data, [])

  const blockTimestamp = decodeFunctionResult({
    abi: multicallGetCurrentBlockTimestampSnippet,
    functionName: 'getCurrentBlockTimestamp',
    data: result[0].returnData,
  })

  const contractToUse = getContractToUse(contract, labels)

  let expiry: bigint
  let gracePeriod: bigint = 0n

  if (contractToUse === 'nameWrapper') {
    ;[, , expiry] = decodeFunctionResult({
      abi: nameWrapperGetDataSnippet,
      functionName: 'getData',
      data: result[1].returnData,
    })
  } else {
    expiry = decodeFunctionResult({
      abi: baseRegistrarNameExpiresSnippet,
      functionName: 'nameExpires',
      data: result[1].returnData,
    })
    gracePeriod = decodeFunctionResult({
      abi: baseRegistrarGracePeriodSnippet,
      functionName: 'GRACE_PERIOD',
      data: result[2].returnData,
    })
  }

  if (expiry === 0n) {
    return null
  }

  let status: ExpiryStatus = 'active'

  if (blockTimestamp > expiry + gracePeriod) {
    status = 'expired'
  } else if (blockTimestamp > expiry) {
    status = 'gracePeriod'
  }

  return {
    expiry: {
      date: makeSafeSecondsDate(expiry),
      value: expiry,
    },
    gracePeriod: Number(gracePeriod),
    status,
  }
}

type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>

/**
 * Gets the expiry for a name
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetExpiryParameters}
 * @returns Expiry object, or `null` if no expiry. {@link GetExpiryReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getExpiry } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getExpiry(client, { name: 'ens.eth' })
 * // { expiry: { date: Date, value: 1913933217n }, gracePeriod: 7776000, status: 'active' }
 */
const getExpiry = generateFunction({ encode, decode }) as ((
  client: ClientWithEns,
  { name, contract }: GetExpiryParameters,
) => Promise<GetExpiryReturnType>) &
  BatchableFunctionObject

export default getExpiry
