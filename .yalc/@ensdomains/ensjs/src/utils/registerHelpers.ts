import { defaultAbiCoder } from '@ethersproject/abi'
import { keccak256 } from '@ethersproject/keccak256'
import type { PublicResolver } from '../generated'
import { CombinedFuseInput, encodeFuses, hasFuses } from './fuses'
import { labelhash } from './labels'
import { namehash } from './normalise'
import { generateRecordCallArray, RecordOptions } from './recordHelpers'

export type BaseRegistrationParams = {
  owner: string
  duration: number
  secret: string
  resolverAddress?: string
  records?: RecordOptions
  reverseRecord?: boolean
  fuses?: CombinedFuseInput['child']
}

export type RegistrationParams = Omit<
  BaseRegistrationParams,
  'resolverAddress'
> & {
  name: string
  resolver: PublicResolver
}

export type CommitmentParams = Omit<RegistrationParams, 'secret'> & {
  secret?: string
}

export type RegistrationTuple = [
  name: string,
  owner: string,
  duration: number,
  secret: string,
  resolver: string,
  data: string[],
  reverseRecord: boolean,
  ownerControlledFuses: number,
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
  secret,
}: CommitmentParams & {
  secret: string
}): RegistrationTuple => {
  const labelHash = labelhash(name.split('.')[0])
  const hash = namehash(name)
  const resolverAddress = resolver.address
  const fuseData = hasFuses(fuses) ? encodeFuses(fuses!, 'child') : 0

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
    labelHash,
    owner,
    duration,
    secret,
    resolverAddress,
    data,
    !!reverseRecord,
    fuseData,
  ]
}

export const makeRegistrationData = (
  params: RegistrationParams,
): RegistrationTuple => {
  const commitmentData = makeCommitmentData(params)
  const label = params.name.split('.')[0]
  commitmentData[0] = label
  return commitmentData
}

export const _makeCommitment = (params: RegistrationTuple) => {
  return keccak256(
    defaultAbiCoder.encode(
      [
        'bytes32',
        'address',
        'uint256',
        'bytes32',
        'address',
        'bytes[]',
        'bool',
        'uint16',
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
  }
}
