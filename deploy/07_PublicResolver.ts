import { ethers as _ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract, setEthersProvider } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const ethers = setEthersProvider(_ethers)

  const { getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()

  const signer = ethers.provider.getSigner(deployer)

  const ReverseRegistrar = await ethers.getContract('ReverseRegistrar', signer)

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  const controllerAddress = (await ethers.getContract('ETHRegistrarController'))
    .address
  const reverseRegistrarAddress = ReverseRegistrar.address
  const wrapperAddress = (await ethers.getContract('NameWrapper')).address

  const PublicResolver = await deployContract(
    'PublicResolver',
    registryAddress,
    wrapperAddress,
    controllerAddress,
    reverseRegistrarAddress,
  )

  console.log(
    'PublicResolver:',
    'Deployed with address',
    PublicResolver.address,
  )

  const tx = await ReverseRegistrar.setDefaultResolver(PublicResolver.address)
  await tx.wait()

  console.log(
    'PublicResolver:',
    'Set PublicResolver as default resolver on ReverseRegistrar',
  )
}

export default func
