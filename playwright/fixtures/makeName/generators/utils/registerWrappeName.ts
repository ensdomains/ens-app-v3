import {
  type Address,
  type Hex,
  encodeAbiParameters,
  encodeFunctionData,
  keccak256,
  labelhash,
  namehash,
  type PublicClient,
  type WalletClient,
} from 'viem'

import {
  EMPTY_ADDRESS,
  type RecordOptions,
  generateRecordCallArray,
  type EncodeChildFusesInputObject,
  encodeFuses,
} from '@ensdomains/ensjs/utils'

export type RegistrationParameters = {
  /** Name to register */
  name: string
  /** Address to set owner to */
  owner: Address
  /** Duration of registration */
  duration: number
  /** Random 32 bytes to use for registration */
  secret: Hex
  /** Custom resolver address, defaults to current public resolver deployment */
  resolverAddress?: Address
  /** Records to set upon registration */
  records?: RecordOptions
  /** Sets primary name upon registration */
  reverseRecord?: boolean
  /** Fuses to set upon registration */
  fuses?: EncodeChildFusesInputObject
  /** Value to send with transaction */
  value?: bigint
}

export type CommitmentTuple = [
  labelHash: Hex,
  owner: Address,
  duration: bigint,
  secret: Hex,
  resolver: Address,
  data: Hex[],
  reverseRecord: boolean,
  ownerControlledFuses: number,
]

export type RegistrationTuple = [
  label: string,
  owner: Address,
  duration: bigint,
  secret: Hex,
  resolver: Address,
  data: Hex[],
  reverseRecord: boolean,
  ownerControlledFuses: number,
]

export const makeCommitmentTuple = ({
  name,
  owner,
  duration,
  resolverAddress = EMPTY_ADDRESS,
  records: { coins = [], ...records } = { texts: [], coins: [] },
  reverseRecord,
  fuses,
  secret,
}: RegistrationParameters): CommitmentTuple => {
  const labelHash = labelhash(name.split('.')[0])
  const hash = namehash(name)
  const fuseData = fuses
    ? encodeFuses({ restriction: 'child', input: fuses })
    : 0

  if (
    reverseRecord &&
    !coins.find(
      (c) =>
        (typeof c.coin === 'string' && c.coin.toLowerCase() === 'eth') ||
        (typeof c.coin === 'string'
          ? Number.parseInt(c.coin) === 60
          : c.coin === 60),
    )
  ) {
    coins.push({ coin: 60, value: owner })
  }

  const data = records
    ? generateRecordCallArray({ namehash: hash, coins, ...records })
    : []

  if (data.length > 0 && resolverAddress === EMPTY_ADDRESS)
    throw new Error('resolver address required')

  return [
    labelHash,
    owner,
    BigInt(duration),
    secret,
    resolverAddress,
    data,
    !!reverseRecord,
    fuseData,
  ]
}

export const makeRegistrationTuple = (
  params: RegistrationParameters,
): RegistrationTuple => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_labelhash, ...commitmentData] = makeCommitmentTuple(params)
  const label = params.name.split('.')[0]
  return [label, ...commitmentData]
}

export const makeCommitment = (params: RegistrationParameters): Hex => {
  const tuple = makeCommitmentTuple(params)
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'name', type: 'bytes32' },
        { name: 'owner', type: 'address' },
        { name: 'duration', type: 'uint256' },
        { name: 'secret', type: 'bytes32' },
        { name: 'resolver', type: 'address' },
        { name: 'data', type: 'bytes[]' },
        { name: 'reverseRecord', type: 'bool' },
        { name: 'ownerControlledFuses', type: 'uint16' },
      ],
      tuple,
    ),
  )
}

// Contract ABIs
const COMMITMENT_ABI = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'commitment', type: 'bytes32' },
    ],
    name: 'commit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const REGISTER_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
      { internalType: 'address', name: 'resolver', type: 'address' },
      { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
      { internalType: 'bool', name: 'reverseRecord', type: 'bool' },
      { internalType: 'uint16', name: 'ownerControlledFuses', type: 'uint16' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export const commitName = {
  makeFunctionData: (
    client: PublicClient | WalletClient,
    params: RegistrationParameters,
  ) => {
    const commitment = makeCommitment(params)
    const contracts = client.chain?.contracts
    const controllerContract = contracts?.nameWrapperEthRegistrarController as any
    const controllerAddress = controllerContract?.address ||
                             (controllerContract && typeof controllerContract === 'object' &&
                              Object.values(controllerContract)[0] as any)?.address

    if (!controllerAddress) {
      throw new Error('NameWrapper ETH Registrar Controller address not found in chain config')
    }

    return {
      to: controllerAddress as Address,
      data: encodeFunctionData({
        abi: COMMITMENT_ABI,
        functionName: 'commit',
        args: [commitment],
      }),
      abi: COMMITMENT_ABI,
      functionName: 'commit' as const,
      args: [commitment],
    }
  },
}

export const registerName = {
  makeFunctionData: (
    client: PublicClient | WalletClient,
    params: RegistrationParameters,
  ) => {
    const registrationTuple = makeRegistrationTuple(params)
    const contracts = client.chain?.contracts
    const controllerContract = contracts?.nameWrapperEthRegistrarController as any
    const controllerAddress = controllerContract?.address ||
                             (controllerContract && typeof controllerContract === 'object' &&
                              Object.values(controllerContract)[0] as any)?.address

    if (!controllerAddress) {
      throw new Error('NameWrapper ETH Registrar Controller address not found in chain config')
    }

    return {
      to: controllerAddress as Address,
      data: encodeFunctionData({
        abi: REGISTER_ABI,
        functionName: 'register',
        args: registrationTuple,
      }),
      abi: REGISTER_ABI,
      functionName: 'register' as const,
      args: registrationTuple,
      value: params.value,
    }
  },
}