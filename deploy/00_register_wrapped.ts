import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    name: 'wrapped.eth',
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
      const { name, data, reverseRecord, fuses } = nameObj
      const ownerAddr = allNamedAccts[nameObj.owner]
      const resolver = publicResolver.address
      const duration = 31536000

      const commitment = await controller.makeCommitment(
        name,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
      )

      const commitTx = await controller.commit(commitment)
      console.log(`Commiting commitment for ${name} (tx: ${commitTx.hash})...`)
      await commitTx.wait()

      await network.provider.send('evm_increaseTime', [60])
      await network.provider.send('evm_mine')

      // for anvil:
      // await network.provider.send('evm_setNextBlockTimestamp', [
      //   Math.floor(Date.now() / 1000) + 60,
      // ])

      const [price] = await controller.rentPrice(name, duration)

      const registerTx = await controller.register(
        name,
        ownerAddr,
        duration,
        secret,
        resolver,
        data,
        reverseRecord,
        fuses,
        {
          from: owner,
          value: price,
        },
      )
      console.log(`Registering name ${name} (tx: ${registerTx.hash})...`)
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
