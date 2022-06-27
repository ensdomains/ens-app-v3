import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const DummyOracle = await deployContract('DummyOracle', '100000000')

  const dummyOracleAddress = DummyOracle.address
  console.log('DummyOracle:', 'Deployed with address', dummyOracleAddress)
}

export default func
