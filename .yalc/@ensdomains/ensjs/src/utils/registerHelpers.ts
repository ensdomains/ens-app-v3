import { utils } from 'ethers'
import type { FuseOptions } from '../@types/FuseOptions'
import type { PublicResolver } from '../generated'
import generateFuseInput from './generateFuseInput'
import { labelhash } from './labels'
import { namehash } from './normalise'
import { generateRecordCallArray, RecordOptions } from './recordHelpers'

export type RegistrationParams = {
  name: string
  owner: string
  duration: number
  secret: string
  resolver: PublicResolver
  records?: RecordOptions
  reverseRecord?: boolean
  fuses?: FuseOptions
  wrapperExpiry: number
}

export type CommitmentParams = Omit<
  RegistrationParams,
  'secret' | 'wrapperExpiry'
> & {
  secret?: string
  wrapperExpiry?: number
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
  wrapperExpiry: number,
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
  wrapperExpiry: number,
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
    wrapperExpiry || Math.floor(Date.now() / 1000) + duration,
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
