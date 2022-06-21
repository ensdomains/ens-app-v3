import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const metadataHost = ''
  const metadataUrl = `${metadataHost}/name/0x{id}`

  console.log('Running Deployments...')

  const StaticMetadataService = await deployContract(
    'StaticMetadataService',
    metadataUrl,
  )

  const metadataAddress = StaticMetadataService.address
  console.log(
    'StaticMetadataService:',
    'Deployed with address',
    metadataAddress,
  )
}

export default func
