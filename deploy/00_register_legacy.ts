import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    name: 'test123.eth',
    owner: 'owner',
    addr: 'owner',
  },
]

const randomSecret = () => {
  return `0x${crypto.randomBytes(32).toString('hex')}`
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const { owner } = await getNamedAccounts()
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract(
    'LegacyETHRegistrarController',
    owner,
  )
  const publicResolver = await ethers.getContract('LegacyPublicResolver')

  await Promise.all(
    names.map(async (nameObj) => {
      const secret = randomSecret()
      const { name } = nameObj
      const registrant = allNamedAccts[nameObj.owner]
      const resolver = publicResolver.address
      const addr = allNamedAccts[nameObj.addr]
      const duration = 31536000

      const commitment = await controller.makeCommitmentWithConfig(
        name,
        registrant,
        secret,
        resolver,
        addr,
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

      const price = await controller.rentPrice(name, duration)

      const registerTx = await controller.registerWithConfig(
        name,
        registrant,
        duration,
        secret,
        resolver,
        addr,
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

func.id = 'register-unwrapped-names'
func.tags = ['register-unwrapped-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
