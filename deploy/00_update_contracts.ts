/* eslint-disable import/no-extraneous-dependencies */
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { getContract, getNamedClients } from './utils/viem-hardhat'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await getNamedClients(hre)()

  const dummyOracale = (await getContract(hre)('DummyOracle', deployer))!

  const txHash = await dummyOracale.write['set(int256)'](['156058000000'], {})

  console.log(`Setting dummy oracle to 156058000000 (tx: ${txHash})...`)
  return true
}

func.id = 'update_contracts'
func.runAtTheEnd = true

export default func
