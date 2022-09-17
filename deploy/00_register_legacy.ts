/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { namehash } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const names = [
  {
    label: 'test123',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'to-be-wrapped',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'resume-and-wrap',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'other-registrant',
    namedOwner: 'deployer',
    namedAddr: 'deployer',
  },
  {
    label: 'other-eth-record',
    namedOwner: 'owner',
    namedAddr: 'deployer',
  },
  {
    label: 'from-settings',
    namedOwner: 'owner',
    namedAddr: 'owner',
  },
  {
    label: 'other-controller',
    namedOwner: 'owner',
    namedAddr: 'owner',
    namedController: 'deployer',
  },
]

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, network } = hre
  const allNamedAccts = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')
  const controller = await ethers.getContract('LegacyETHRegistrarController')
  const publicResolver = await ethers.getContract('LegacyPublicResolver')

  await network.provider.send('anvil_setBlockTimestampInterval', [60])

  for (const { label, namedOwner, namedAddr } of names) {
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000000'
    const registrant = allNamedAccts[namedOwner]
    const resolver = publicResolver.address
    const addr = allNamedAccts[namedAddr]
    const duration = 31536000

    const commitment = await controller.makeCommitmentWithConfig(
      label,
      registrant,
      secret,
      resolver,
      addr,
    )

    const _controller = controller.connect(await ethers.getSigner(registrant))
    const commitTx = await _controller.commit(commitment)
    console.log(`Commiting commitment for ${label}.eth (tx: ${commitTx.hash})...`)
    await commitTx.wait()

    await network.provider.send('evm_mine')

    const price = await controller.rentPrice(label, duration)

    const registerTx = await _controller.registerWithConfig(
      label,
      registrant,
      duration,
      secret,
      resolver,
      addr,
      {
        value: price,
      },
    )
    console.log(`Registering name ${label}.eth (tx: ${registerTx.hash})...`)
    await registerTx.wait()
  }

  await network.provider.send('anvil_setBlockTimestampInterval', [1])

  for (const { label, namedController, namedOwner } of names.filter((n) => n.namedController)) {
    const registrant = allNamedAccts[namedOwner]
    const owner = allNamedAccts[namedController!]

    const _registry = registry.connect(await ethers.getSigner(registrant))
    const setControllerTx = await _registry.setOwner(namehash(`${label}.eth`), owner)
    console.log(`Setting controller for ${label}.eth to ${owner} (tx: ${setControllerTx.hash})...`)
    await setControllerTx.wait()
  }

  return true
}

func.id = 'register-unwrapped-names'
func.tags = ['register-unwrapped-names']
func.dependencies = ['LegacyETHRegistrarController']
func.runAtTheEnd = true

export default func
