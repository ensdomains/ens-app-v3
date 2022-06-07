import { BaseRegistrarImplementation__factory } from '@ensdomains/ensjs/dist/cjs/generated/factories/BaseRegistrarImplementation__factory'
import { ethers as _ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract, setEthersProvider } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const ethers = setEthersProvider(_ethers)

  const { getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
  const registrarAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
  const metadataAddress = (await ethers.getContract('StaticMetadataService'))
    .address

  const NameWrapper = await deployContract(
    'NameWrapper',
    registryAddress,
    registrarAddress,
    metadataAddress,
  )

  const nameWrapperAddress = NameWrapper.address

  console.log('NameWrapper:', 'Deployed with address', nameWrapperAddress)

  const baseRegistrar = BaseRegistrarImplementation__factory.connect(
    registrarAddress,
    ethers.provider.getSigner(deployer),
  )

  const tx = await baseRegistrar.addController(nameWrapperAddress, {
    from: deployer,
  })

  await tx?.wait()

  console.log(
    'NameWrapper:',
    'Added NameWrapper as controller for BaseRegistrar',
  )
}

export default func
