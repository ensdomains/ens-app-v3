/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { type Account } from 'viem'

import {
  makeCommitment as generateCommitment,
  makeRegistrationTuple,
  RecordOptions,
  RegistrationParameters,
} from '@ensdomains/ensjs/utils'

import { ONE_YEAR } from '../src/utils/time'
import { nonceManager } from './.utils/nonceManager'

const MIN_REGISTRATION_DURATION = 28 * 24 * 60 * 60 // 28 Days

type Name = {
  name: string
  namedOwner: string
  reverseRecord?: boolean
  records?: RecordOptions
  fuses?: RegistrationParameters['fuses']
  customDuration?: number
  renewalDuration?: number // Duration for legacy renewal
}

type ProcessedNameData = Omit<RegistrationParameters, 'owner'> & {
  label: string
  resolverAddress: string
  secret: string
  duration: number
  renewalDuration: number
  owner: Account
  name: string
  fuses?: RegistrationParameters['fuses']
}

const names: Name[] = [
  {
    name: 'desynced-wrapped.eth',
    namedOwner: 'owner',
    reverseRecord: false,
    customDuration: MIN_REGISTRATION_DURATION, // 28 days initial registration (minimum)
    renewalDuration: ONE_YEAR, // 1 year renewal via legacy controller
    records: {
      texts: [
        {
          key: 'description',
          value: 'A name that demonstrates desync between wrapper and registry',
        },
        { key: 'url', value: 'https://ens.domains' },
      ],
      coins: [{ coin: 'ETH', value: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' }],
    },
  },
  {
    name: 'desynced-wrapped-grace-period.eth',
    namedOwner: 'owner',
    reverseRecord: false,
    customDuration: MIN_REGISTRATION_DURATION, // 28 days initial registration (minimum)
    renewalDuration: 5011200 - MIN_REGISTRATION_DURATION, // 28 days initial registration (minimum)
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { network, viem } = hre
  const allNamedClients = await viem.getNamedClients()
  const publicClient = await viem.getPublicClient()

  // Get contracts for wrapped registration
  const controller = await viem.getContract('ETHRegistrarController')
  const publicResolver = await viem.getContract('PublicResolver')

  // Get legacy controller for renewal
  const legacyController = await viem.getContract('LegacyETHRegistrarController')

  const makeData = ({
    namedOwner,
    customDuration,
    renewalDuration,
    fuses,
    name,
    ...rest
  }: Name) => {
    const resolverAddress = publicResolver.address
    // eslint-disable-next-line no-restricted-syntax
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000' as const
    const duration = customDuration || MIN_REGISTRATION_DURATION
    const renewal = renewalDuration || MIN_REGISTRATION_DURATION
    const owner = allNamedClients[namedOwner].account

    return {
      resolverAddress,
      secret,
      duration,
      renewalDuration: renewal,
      owner,
      name,
      label: name.split('.')[0],
      fuses: fuses || undefined,
      ...rest,
    }
  }

  const makeWrappedCommitment =
    (nonce: number) =>
    async ({ owner, name, ...rest }: ProcessedNameData, index: number) => {
      const commitment = generateCommitment({ owner: owner.address, name, ...rest })
      const commitTxHash = await controller.write.commit([commitment], {
        nonce: nonce + index,
        account: owner,
      })
      console.log(`Commiting wrapped commitment for ${name} (tx: ${commitTxHash})...`)
      return 1
    }

  const makeWrappedRegistration =
    (nonce: number) =>
    async ({ owner, name, duration, label, ...rest }: ProcessedNameData, index: number) => {
      const { base: price } = await controller.read.rentPrice([label, BigInt(duration)])
      const registerTxHash = await controller.write.register(
        makeRegistrationTuple({ owner: owner.address, name, duration, ...rest }),
        {
          account: owner,
          value: price,
          nonce: nonce + index,
        },
      )
      console.log(`Registering wrapped name ${name} (tx: ${registerTxHash})...`)
      return 1
    }

  const makeLegacyRenewal =
    (nonce: number) =>
    async ({ owner, label, renewalDuration }: ProcessedNameData, index: number) => {
      const price = await legacyController.read.rentPrice([label, BigInt(renewalDuration)])
      const renewTxHash = await legacyController.write.renew([label, BigInt(renewalDuration)], {
        account: owner,
        value: price,
        nonce: nonce + index,
      })
      console.log(
        `Renewing ${label}.eth via legacy controller for ${renewalDuration}s (tx: ${renewTxHash})...`,
      )
      return 1
    }

  const allNameData = names.map(makeData)

  const getNonceAndApply = nonceManager(allNamedClients, allNameData)

  console.log('=== Starting Desynced Name Registration Process ===')

  // Phase 1: Wrapped Registration (commitment + registration)
  console.log('Phase 1: Wrapped Registration')
  await network.provider.send('evm_setAutomine', [false])

  // Commit
  await getNonceAndApply('owner', makeWrappedCommitment)
  await network.provider.send('evm_mine')

  // Wait for commitment time
  const oldTimestamp = await publicClient.getBlock().then((b) => Number(b.timestamp))
  await network.provider.send('evm_setNextBlockTimestamp', [oldTimestamp + 60])
  await network.provider.send('evm_mine')

  // Register as wrapped
  await getNonceAndApply('owner', makeWrappedRegistration)
  await network.provider.send('evm_mine')

  console.log('Phase 1 complete: Name registered as wrapped')

  // Phase 2: Legacy Renewal (creates desync)
  console.log('Phase 2: Legacy Renewal to create desync')

  // Move forward some time to simulate normal usage
  const currentTimestamp = await publicClient.getBlock().then((b) => Number(b.timestamp))
  await network.provider.send('evm_setNextBlockTimestamp', [currentTimestamp + 86400]) // 1 day later
  await network.provider.send('evm_mine')

  // Renew via legacy controller (this will extend registry but not wrapper)
  await getNonceAndApply('owner', makeLegacyRenewal)
  await network.provider.send('evm_mine')

  console.log('Phase 2 complete: Name renewed via legacy controller - desync created!')

  // Re-enable automine
  await network.provider.send('evm_setAutomine', [true])
  await network.provider.send('anvil_setBlockTimestampInterval', [1])
  await network.provider.send('evm_mine')

  console.log('=== Desynced Name Registration Complete ===')
  console.log('Result: Registry expiry extended, wrapper expiry unchanged - names are now desynced')

  return true
}

func.id = 'register-desynced-names'
func.tags = ['register-desynced-names']
func.dependencies = ['register-wrapped-names', 'register-unwrapped-names']
func.runAtTheEnd = true

export default func
