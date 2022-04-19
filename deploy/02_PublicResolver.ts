import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get } = deployments

  const { deployer } = await getNamedAccounts()

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  const controllerAddress = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'
  const reverseRegisrarAddress = '0x084b1c3C81545d370f3634392De611CaaBFf8148'
  const wrapperAddress = (await get('NameWrapper')).address

  await deploy('PublicResolver', {
    from: deployer,
    args: [
      registryAddress,
      wrapperAddress,
      controllerAddress,
      reverseRegisrarAddress,
    ],
  })

  console.log(
    'Deployed PublicResolver, address:',
    (await deployments.get('PublicResolver')).address,
  )
}

export default func
