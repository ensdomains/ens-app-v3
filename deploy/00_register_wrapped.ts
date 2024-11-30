/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Address, namehash } from 'viem'

import {
  encodeFuses,
  makeCommitment as generateCommitment,
  makeRegistrationTuple,
  RecordOptions,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'

import { nonceManager } from './.utils/nonceManager'
import { getContract } from './utils/viem-hardhat'

type Name = {
  name: string
  namedOwner: string
  reverseRecord?: boolean
  records?: RecordOptions
  fuses?: RegistrationParameters['fuses']
  customDuration?: number
  subnames?: {
    label: string
    namedOwner: string
    fuses?: number
    expiry?: number
  }[]
}

type ProcessedSubname = {
  label: string
  owner: Address
  expiry: number
  fuses: number
}

const names: Name[] = [
  {
    name: 'wrapped.eth',
    namedOwner: 'owner',
    subnames: [
      { label: 'sub', namedOwner: 'deployer' },
      { label: 'test', namedOwner: 'deployer' },
      { label: 'legacy', namedOwner: 'deployer' },
      { label: 'xyz', namedOwner: 'deployer' },
    ],
  },
  {
    name: 'wrapped-expired-subnames.eth',
    namedOwner: 'owner',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'day-expired',
        namedOwner: 'owner',
        // set expiry to 24 hours ago
        expiry: Math.floor(Date.now() / 1000) - 86400,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'hour-expired',
        namedOwner: 'owner',
        // set expiry to 24 hours ago
        expiry: Math.floor(Date.now() / 1000) - 3600,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'two-minute-expired',
        namedOwner: 'owner',
        expiry: Math.floor(Date.now() / 1000) - 120,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'two-minute-expiring',
        namedOwner: 'owner',
        expiry: Math.floor(Date.now() / 1000) + 120,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'hour-expiring',
        namedOwner: 'owner',
        // set expiry to 24 hours ago
        expiry: Math.floor(Date.now() / 1000) + 3600,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'no-pcc',
        namedOwner: 'owner',
        expiry: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        label: 'not-expired',
        namedOwner: 'owner',
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
    ],
  },
  {
    name: 'wrapped-to-delete.eth',
    namedOwner: 'owner',
    subnames: [
      { label: 'parent-not-child', namedOwner: 'deployer' },
      { label: 'parent-child', namedOwner: 'owner' },
      { label: 'not-parent-child', namedOwner: 'deployer' },
    ],
  },
  {
    name: 'emancipated-to-delete.eth',
    namedOwner: 'owner',
    fuses: {
      named: ['CANNOT_UNWRAP'],
    },
    subnames: [
      {
        label: 'parent-not-child',
        namedOwner: 'deployer',
        expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'parent-child',
        namedOwner: 'owner',
        expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
      {
        label: 'not-parent-child',
        namedOwner: 'deployer',
        expiry: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
        fuses: encodeFuses({ input: { parent: { named: ['PARENT_CANNOT_CONTROL'] } } }),
      },
    ],
  },
]

type ProcessedNameData = RegistrationParameters & {
  label: string
  subnames: ProcessedSubname[]
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = (await getNamedAccounts()) as Record<string, Address>

  const controller = (await getContract(hre)('ETHRegistrarController'))!
  const publicResolver = (await getContract(hre)('PublicResolver'))!
  const nameWrapper = (await getContract(hre)('NameWrapper'))!

  const makeData = ({ namedOwner, customDuration, fuses, name, subnames, ...rest }: Name) => {
    const resolverAddress = publicResolver.address

    const secret =
      // eslint-disable-next-line no-restricted-syntax
      '0x0000000000000000000000000000000000000000000000000000000000000000' as const
    const duration = customDuration || 31536000
    // 1659467455 is the approximate time of the transaction, this is for keeping block hashes the same
    const wrapperExpiry = 1659467455 + duration
    const owner = allNamedAccts[namedOwner]

    const processedSubnames: ProcessedSubname[] =
      subnames?.map(
        ({ label, namedOwner: subNamedOwner, fuses: subnameFuses, expiry: subnameExpiry }) => ({
          label,
          owner: allNamedAccts[subNamedOwner],
          expiry: subnameExpiry || wrapperExpiry,
          fuses: subnameFuses || 0,
        }),
      ) || []

    return {
      resolverAddress,
      secret,
      duration,
      owner,
      name,
      label: name.split('.')[0],
      subnames: processedSubnames,
      fuses: fuses || undefined,
      ...rest,
    }
  }

  const makeCommitment =
    (nonce: number) =>
    async ({ owner, name, ...rest }: ProcessedNameData, index: number) => {
      const commitment = generateCommitment({ owner, name, ...rest })

      const commitTx = await controller.write.commit([commitment], {
        nonce: nonce + index,
        account: owner,
      })
      console.log(`Commiting commitment for ${name} (tx: ${commitTx})...`)
      return 1
    }

  const makeRegistration =
    (nonce: number) =>
    async ({ owner, name, duration, label, ...rest }: ProcessedNameData, index: number) => {
      const [price] = await controller.read.rentPrice([label, duration])

      const _controller = controller.connect(await ethers.getSigner(owner))

      const registerTx = await _controller.register(
        ...makeRegistrationTuple({ owner, name, duration, ...rest }),
        {
          value: price,
          nonce: nonce + index,
        },
      )
      console.log(`Registering name ${name} (tx: ${registerTx.hash})...`)

      return 1
    }

  const makeSubname =
    (nonce: number) =>
    async ({ name, subnames, owner }: ProcessedNameData, index: number) => {
      for (let i = 0; i < subnames.length; i += 1) {
        const { label, owner: subOwner, fuses, expiry } = subnames[i]
        const _nameWrapper = nameWrapper.connect(await ethers.getSigner(owner))
        const subnameTx = await _nameWrapper.setSubnodeOwner(
          namehash(name),
          label,
          subOwner,
          fuses,
          expiry,
          {
            nonce: nonce + index + i,
          },
        )
        console.log(`Creating subname ${label}.${name} (tx: ${subnameTx.hash})...`)
      }
      return subnames.length
    }

  const allNameData = names.map(makeData)

  const getNonceAndApply = nonceManager(ethers, allNamedAccts, allNameData)

  await network.provider.send('evm_setAutomine', [false])
  await getNonceAndApply('owner', makeCommitment)
  await network.provider.send('evm_mine')
  const oldTimestamp = (await ethers.provider.getBlock('latest')).timestamp
  await network.provider.send('evm_setNextBlockTimestamp', [oldTimestamp + 60])
  await network.provider.send('evm_mine')
  await getNonceAndApply('owner', makeRegistration)
  await network.provider.send('evm_mine')
  await getNonceAndApply('owner', makeSubname)
  await network.provider.send('evm_mine')

  await network.provider.send('evm_setAutomine', [true])
  await network.provider.send('anvil_setBlockTimestampInterval', [1])
  await network.provider.send('evm_mine')

  return true
}

func.id = 'register-wrapped-names'
func.tags = ['register-wrapped-names']
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
