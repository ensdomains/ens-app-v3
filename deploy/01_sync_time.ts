/* eslint-disable import/no-extraneous-dependencies */
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { network } = hre

  await network.provider.send('evm_setAutomine', [false])
  // Skip forward 28 + 90 days so that minimum exp names go into premium
  await network.provider.send('anvil_setBlockTimestampInterval', [2419200 + 7776000])
  await network.provider.send('evm_mine')

  await network.provider.send('evm_setAutomine', [true])
  await network.provider.send('anvil_setBlockTimestampInterval', [1])
  await network.provider.send('evm_mine')

  return true
}

func.id = 'sync-time'
func.tags = ['sync-time']
func.dependencies = [
  'register-unwrapped-names',
  'register-wrapped-names',
  'register-desynced-names',
]
func.runAtTheEnd = true

export default func
