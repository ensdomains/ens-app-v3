import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments

  const { deployer } = await getNamedAccounts()

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  const registrarAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
  const metadataAddress = (await get('StaticMetadataService')).address

  await deploy('NameWrapper', {
    from: deployer,
    args: [registryAddress, registrarAddress, metadataAddress],
  })

  console.log(
    'Deployed NameWrapper, address:',
    (await deployments.get('NameWrapper')).address,
  )
}

export default func
