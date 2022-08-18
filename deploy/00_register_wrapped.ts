/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
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

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const controller = await ethers.getContract('ETHRegistrarController')
  const publicResolver = await ethers.getContract('PublicResolver')

  for (const { label, namedOwner, data, reverseRecord, fuses } of names) {
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const owner = allNamedAccts[namedOwner]
    const resolver = publicResolver.address
    const duration = 31536000
    // 1659467455 is the approximate time of the transaction, this is for keeping block hashes the same
    const wrapperExpiry = 1659467455 + duration

    await network.provider.send('anvil_setBlockTimestampInterval', [60])

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
    console.log(`Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`)
    await commitTx.wait()

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

  await network.provider.send('anvil_setBlockTimestampInterval', [1])

  return true
}

func.id = 'register-wrapped-names'
func.tags = ['register-wrapped-names']
func.dependencies = ['ETHRegistrarController']
func.runAtTheEnd = true

export default func
