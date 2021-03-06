/* eslint-disable no-await-in-loop */
import crypto from 'crypto'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    label: 'wrapped',
    namedOwner: 'owner',
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
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController')
  const publicResolver = await ethers.getContract('PublicResolver')

  for (const { label, namedOwner, data, reverseRecord, fuses } of names) {
    const secret = randomSecret()
    const owner = allNamedAccts[namedOwner]
    const resolver = publicResolver.address
    const duration = 31536000
    const wrapperExpiry = 0

    const commitment = await controller.makeCommitment(
      label,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      fuses,
      wrapperExpiry,
    )

    const _controller = controller.connect(await ethers.getSigner(owner))
    const commitTx = await controller.commit(commitment)
    console.log(
      `Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`,
    )
    await commitTx.wait()

    await network.provider.send('evm_increaseTime', [60])
    await network.provider.send('evm_mine')

    const [price] = await controller.rentPrice(label, duration)

    const registerTx = await _controller.register(
      label,
      owner,
      duration,
      secret,
      resolver,
      data,
      reverseRecord,
      fuses,
      wrapperExpiry,
      {
        value: price,
      },
    )
    console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)
    await registerTx.wait()
  }

  return true
}

func.id = 'register-wrapped-names'
func.tags = ['register-wrapped-names']
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
