import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy, get, execute } = deployments

  const { deployer } = await getNamedAccounts()

  const ReverseRegistrar = await ethers.getContract('ReverseRegistrar')

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  const controllerAddress = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'
  const reverseRegistrarAddress = ReverseRegistrar.address
  const wrapperAddress = (await get('NameWrapper')).address

  await deploy('PublicResolver', {
    from: deployer,
    args: [
      registryAddress,
      wrapperAddress,
      controllerAddress,
      reverseRegistrarAddress,
    ],
  })

  const tx = await ReverseRegistrar.setDefaultResolver(
    (
      await get('PublicResolver')
    ).address,
  )
  await tx.wait()

  console.log(
    'Deployed PublicResolver, address:',
    (await deployments.get('PublicResolver')).address,
  )
}

export default func
