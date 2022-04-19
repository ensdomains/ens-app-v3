import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

  const UniversalResolver = await deploy('UniversalResolver', {
    from: deployer,
    args: [registryAddress],
  })

  const universalAddress = UniversalResolver.address
  console.log('Deployed UniversalResolver, address:', universalAddress)
}

export default func
