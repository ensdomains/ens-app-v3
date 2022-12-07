import { BigNumberish, utils } from 'ethers'
import type { PublicResolver } from '../generated'
import { FuseOptions } from './fuses'
import generateFuseInput from './generateFuseInput'
import { labelhash } from './labels'
import { namehash } from './normalise'
import { generateRecordCallArray, RecordOptions } from './recordHelpers'

export const MAX_INT_64 = 2n ** 64n - 1n

export type BaseRegistrationParams = {
  owner: string
  duration: number
  secret: string
  resolverAddress?: string
  records?: RecordOptions
  reverseRecord?: boolean
  fuses?: FuseOptions
  wrapperExpiry?: BigNumberish
}

export type RegistrationParams = Omit<
  BaseRegistrationParams,
  'resolverAddress'
> & {
  name: string
  resolver: PublicResolver
}

export type CommitmentParams = Omit<
  RegistrationParams,
  'secret' | 'wrapperExpiry'
> & {
  secret?: string
  wrapperExpiry?: BigNumberish
}

export type RegistrationTuple = [
  name: string,
  owner: string,
  duration: number,
  secret: string,
  resolver: string,
  data: string[],
  reverseRecord: boolean,
  fuses: string,
  wrapperExpiry: BigNumberish,
]

export type CommitmentTuple = [
  labelhash: string,
  owner: string,
  duration: number,
  resolver: string,
  data: string[],
  secret: string,
  reverseRecord: boolean,
  fuses: string,
  wrapperExpiry: BigNumberish,
]

export const randomSecret = () => {
  const bytes = Buffer.allocUnsafe(32)
  return `0x${crypto.getRandomValues(bytes).toString('hex')}`
}

export const makeCommitmentData = ({
  name,
  owner,
  duration,
  resolver,
  records,
  reverseRecord,
  fuses,
  wrapperExpiry,
  secret,
}: CommitmentParams & {
  secret: string
}): CommitmentTuple => {
  const label = labelhash(name.split('.')[0])
  const hash = namehash(name)
  const resolverAddress = resolver.address
  const fuseData = fuses ? generateFuseInput(fuses) : '0'

  if (reverseRecord) {
    if (!records) {
      records = { coinTypes: [{ key: 'ETH', value: owner }] }
    } else if (!records.coinTypes?.find((c) => c.key === 'ETH')) {
      if (!records.coinTypes) records.coinTypes = []
      records.coinTypes.push({ key: 'ETH', value: owner })
    }
  }

  const data = records ? generateRecordCallArray(hash, records, resolver) : []

  return [
    label,
    owner,
    duration,
    resolverAddress,
    data,
    secret,
    !!reverseRecord,
    fuseData,
    wrapperExpiry || MAX_INT_64,
  ]
}

export const makeRegistrationData = (
  params: RegistrationParams,
): RegistrationTuple => {
  const commitmentData = makeCommitmentData(params)
  const label = params.name.split('.')[0]
  commitmentData[0] = label
  const secret = commitmentData.splice(5, 1)[0]
  commitmentData.splice(3, 0, secret)
  return commitmentData as unknown as RegistrationTuple
}

export const _makeCommitment = (params: CommitmentTuple) => {
  return utils.keccak256(
    utils.defaultAbiCoder.encode(
      [
        'bytes32',
        'address',
        'uint256',
        'address',
        'bytes[]',
        'bytes32',
        'bool',
        'uint32',
        'uint64',
      ],
      params,
    ),
  )
}

export const makeCommitment = ({
  secret = randomSecret(),
  ...inputParams
}: CommitmentParams) => {
  const generatedParams = makeCommitmentData({
    ...inputParams,
    secret,
  })

  const commitment = _makeCommitment(generatedParams)

  return {
    secret,
    commitment,
    wrapperExpiry: generatedParams[8],
  }
}
