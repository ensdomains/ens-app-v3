import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const universalAddress = (await deployments.get('UniversalResolver')).address

  await deploy('DoNotCallOnChainUniversalResolverProxy', {
    from: deployer,
    args: [universalAddress],
  })

  console.log(
    'Deployed DoNotCallOnChainUniversalResolverProxy, address:',
    (await deployments.get('DoNotCallOnChainUniversalResolverProxy')).address,
  )

  console.log('Deployments finished!')
}

export default func
