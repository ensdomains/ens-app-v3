import { ethers as _ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract, setEthersProvider } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const ethers = setEthersProvider(_ethers)

  const dummyOracleAddress = (await ethers.getContract('DummyOracle')).address

  const StablePriceOracle = await deployContract(
    'StablePriceOracle',
    dummyOracleAddress,
    [0, 0, 4, 2, 1],
  )

  const stablePriceOracleAddress = StablePriceOracle.address
  console.log(
    'StablePriceOracle:',
    'Deployed with address',
    stablePriceOracleAddress,
  )
}

export default func
