import { BaseRegistrarImplementation__factory } from '@ensdomains/ensjs/dist/cjs/generated/factories/BaseRegistrarImplementation__factory'
import { ethers as _ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract, setEthersProvider } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const ethers = setEthersProvider(_ethers)

  const { getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()

  const signer = ethers.provider.getSigner(deployer)

  const NameWrapper = await ethers.getContract('NameWrapper', signer)
  const ReverseRegistrar = await ethers.getContract('ReverseRegistrar', signer)

  const baseRegistrarAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
  const priceOracleAddress = (await ethers.getContract('StablePriceOracle'))
    .address
  const reverseRegistrarAddress = ReverseRegistrar.address
  const nameWrapperAddress = NameWrapper.address

  const ETHRegistrarController = await deployContract(
    'ETHRegistrarController',
    baseRegistrarAddress,
    priceOracleAddress,
    600,
    84600,
    reverseRegistrarAddress,
    nameWrapperAddress,
  )

  const ethRegistrarControllerAddress = ETHRegistrarController.address

  console.log(
    'ETHRegistrarController:',
    'Deployed with address',
    ethRegistrarControllerAddress,
  )

  const baseRegistrar = BaseRegistrarImplementation__factory.connect(
    baseRegistrarAddress,
    signer,
  )

  const tx = await baseRegistrar.addController(ethRegistrarControllerAddress, {
    from: deployer,
  })

  await tx?.wait()

  console.log(
    'ETHRegistrarController:',
    'Added ETHRegistrarController as controller for BaseRegistrar',
  )

  const tx2 = await NameWrapper.setController(ethRegistrarControllerAddress, {
    from: deployer,
  })

  await tx2?.wait()

  console.log(
    'ETHRegistrarController:',
    'Set ETHRegistrarController as controller for NameWrapper',
  )

  const tx3 = await ReverseRegistrar.setController(
    ethRegistrarControllerAddress,
    { from: deployer },
  )

  await tx3?.wait()

  console.log(
    'ETHRegistrarController:',
    'Set ETHRegistrarController as controller for ReverseRegistrar',
  )
}

export default func
