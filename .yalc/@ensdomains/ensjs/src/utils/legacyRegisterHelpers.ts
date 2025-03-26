import {
  keccak256,
  labelhash,
  type Address,
  type Hex,
  encodePacked,
} from 'viem'
import { EMPTY_ADDRESS } from './consts.js'
import { LegacyRegistrationInvalidConfigError } from '../errors/register.js'

export type LegacyRegistrationParameters = {
  /** Name to register */
  name: string
  /** Address to set owner to */
  owner: Address
  /** Duration of registration */
  duration: number
  /** Random 32 bytes to use for registration */
  secret: Hex
  /** Custom resolver address, defaults to empty address */
  resolverAddress?: Address
  /** Address to set upon registration, defaults to empty address */
  address?: Address
}

export type LegacyRegistrationWithConfigParameters =
  LegacyRegistrationParameters & {
    resolverAddress: Address
    address?: Address
  }

export const isLegacyRegistrationWithConfigParameters = (
  params: LegacyRegistrationParameters,
): params is LegacyRegistrationWithConfigParameters => {
  const { resolverAddress = EMPTY_ADDRESS, address = EMPTY_ADDRESS } =
    params as LegacyRegistrationWithConfigParameters

  if (resolverAddress === EMPTY_ADDRESS && address !== EMPTY_ADDRESS)
    throw new LegacyRegistrationInvalidConfigError({
      resolverAddress,
      address,
    })
  return resolverAddress !== EMPTY_ADDRESS || address !== EMPTY_ADDRESS
}

export type LegacyCommitmentTuple = [label: string, owner: Address, secret: Hex]

export type LegacyCommitmentWithConfigTuple = [
  label: string,
  owner: Address,
  resolverAddress: Address,
  address: Address,
  secret: Hex,
]

export type LegacyRegistrationTuple = [
  label: string,
  owner: Address,
  duration: bigint,
  secret: Hex,
]

export type LegacyRegistrationWithConfigTuple = [
  label: string,
  owner: Address,
  duration: bigint,
  secret: Hex,
  resolverAddress: Address,
  address: Address,
]

export const makeLegacyCommitmentTuple = (
  params: LegacyRegistrationParameters,
): LegacyCommitmentTuple => {
  const { name, owner, secret } = params
  const label = name.split('.')[0]
  return [label, owner, secret]
}

export const makeLegacyCommitmentWithConfigTuple = (
  params: LegacyRegistrationWithConfigParameters,
): LegacyCommitmentWithConfigTuple => {
  const {
    name,
    owner,
    secret,
    resolverAddress = EMPTY_ADDRESS,
    address = EMPTY_ADDRESS,
  } = params as LegacyRegistrationWithConfigParameters
  const label = name.split('.')[0]
  return [label, owner, secret, resolverAddress, address]
}

export const makeLegacyRegistrationTuple = ({
  name,
  owner,
  secret,
  duration,
}: LegacyRegistrationParameters): LegacyRegistrationTuple => {
  const label = name.split('.')[0]
  return [label, owner, BigInt(duration), secret]
}

export const makeLegacyRegistrationWithConfigTuple = ({
  name,
  owner,
  secret,
  duration,
  resolverAddress,
  address = EMPTY_ADDRESS,
}: LegacyRegistrationWithConfigParameters): LegacyRegistrationWithConfigTuple => {
  const label = name.split('.')[0]
  return [label, owner, BigInt(duration), secret, resolverAddress, address]
}

export const makeLegacyCommitmentFromTuple = ([label, ...others]:
  | LegacyCommitmentTuple
  | LegacyCommitmentWithConfigTuple): Hex => {
  const labelHash = labelhash(label)
  const params = [labelHash, ...others] as const

  if (params.length === 3)
    return keccak256(encodePacked(['bytes32', 'address', 'bytes32'], params))

  const [
    owner,
    secret,
    resolverAddress = EMPTY_ADDRESS,
    address = EMPTY_ADDRESS,
  ] = others

  return keccak256(
    encodePacked(
      ['bytes32', 'address', 'address', 'address', 'bytes32'],
      [labelHash, owner, resolverAddress, address, secret],
    ),
  )
}

export const makeLegacyCommitment = (
  params: LegacyRegistrationParameters | LegacyRegistrationWithConfigParameters,
): Hex => {
  const touple = isLegacyRegistrationWithConfigParameters(params)
    ? makeLegacyCommitmentWithConfigTuple(params)
    : makeLegacyCommitmentTuple(params)
  return makeLegacyCommitmentFromTuple(touple)
}
