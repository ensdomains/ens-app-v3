import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

  const UniversalResolver = await deployContract(
    'UniversalResolver',
    registryAddress,
  )

  const universalAddress = UniversalResolver.address
  console.log('UniversalResolver:', 'Deployed with address', universalAddress)
}

export default func
