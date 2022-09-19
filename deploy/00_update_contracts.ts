/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()

  const dummyOracale = await ethers.getContract('DummyOracle')
  const _dummyOracale = dummyOracale.connect(await ethers.getSigner(deployer))
  const txHash = await _dummyOracale['set(int256)']('16')
  await txHash.wait()
  console.log(`Setting dummy oracle to 16 (tx: ${txHash.hash})...`)
  return true
}

func.id = 'update_contracts'
func.runAtTheEnd = true

export default func
