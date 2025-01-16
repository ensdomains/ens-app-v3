/* eslint-disable import/no-extraneous-dependencies */
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { viem } = hre
  const { deployer } = await viem.getNamedClients() 

  const dummyOracale = await viem.getContract('DummyOracle', deployer)

  const txHash = await dummyOracale.write['set(int256)'](['156058000000'], {
    account: deployer.account,
    chain: deployer.public.chain,
  })

  console.log(`Setting dummy oracle to 156058000000 (tx: ${txHash})...`)
  return true
}

func.id = 'update_contracts'
func.runAtTheEnd = true

export default func
