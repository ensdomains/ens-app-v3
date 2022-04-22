import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const metadataHost = ''
  const metadataUrl = `${metadataHost}/name/0x{id}`

  console.log('Deploying NameWrapper...', `[Using: ${deployer}]`)

  const StaticMetadataService = await deploy('StaticMetadataService', {
    from: deployer,
    args: [metadataUrl],
  })

  const metadataAddress = StaticMetadataService.address
  console.log('Deployed StaticMetadataService, address:', metadataAddress)
}

export default func
