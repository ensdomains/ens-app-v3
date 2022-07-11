import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    label: 'wrapped',
    owner: 'owner',
    data: [],
    reverseRecord: true,
    fuses: 0,
  },
]

const randomSecret = () => {
  return `0x${crypto.randomBytes(32).toString('hex')}`
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const { owner } = await getNamedAccounts()
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController', owner)
  const publicResolver = await ethers.getContract('PublicResolver')

  await Promise.all(
    names.map(async (nameObj) => {
      const secret = randomSecret()
      const { label, data, reverseRecord, fuses } = nameObj
      const ownerAddr = allNamedAccts[nameObj.owner]
      const resolver = publicResolver.address
      const duration = 31536000
      const wrapperExpiry = 0

      const commitment = await controller.makeCommitment(
        label,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        wrapperExpiry,
      )

      const commitTx = await controller.commit(commitment)
      console.log(
        `Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`,
      )
      await commitTx.wait()

      await network.provider.send('evm_increaseTime', [60])
      await network.provider.send('evm_mine')

      // for anvil:
      // await network.provider.send('evm_setNextBlockTimestamp', [
      //   Math.floor(Date.now() / 1000) + 60,
      // ])

      const [price] = await controller.rentPrice(label, duration)

      const registerTx = await controller.register(
        label,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        wrapperExpiry,
        {
          from: owner,
          value: price,
        },
      )
      console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)
      await registerTx.wait()
    }),
  )

  return true
}

func.id = 'register-wrapped-names'
func.tags = ['register-wrapped-names']
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
