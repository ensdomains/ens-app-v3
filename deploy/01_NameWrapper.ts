import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

import { utils, constants } from 'ethers'

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

  const nameWrapperAddress = (await deployments.get('NameWrapper')).address
  console.log('Deployed NameWrapper, address:', nameWrapperAddress)

  // Register name ---

  const DAYS = 24 * 60 * 60
  const ethControllerAddress = '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5'

  const name = 'wrapmebaby'
  const secret =
    '0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF'
  const duration = 365 * DAYS

  const signer = await hre.ethers.getSigner(deployer)

  const ethControllerContract = await hre.ethers.getContractAt(
    'ETHRegistrarController',
    ethControllerAddress,
    signer,
  )

  // const available = await ethControllerContract.available(name)
  const commitment = await ethControllerContract.makeCommitment(
    name,
    deployer,
    secret,
  )
  await ethControllerContract.commit(commitment)

  const minCommitmentAge = await ethControllerContract.minCommitmentAge()
  await hre.ethers.provider.send('evm_increaseTime', [
    minCommitmentAge.toNumber(),
  ])
  await hre.ethers.provider.send('evm_mine', [120])

  const value = await ethControllerContract.rentPrice(name, duration)

  const trx = await ethControllerContract.register(
    name,
    deployer,
    duration,
    secret,
    {
      value,
      gasLimit: 10000000,
    },
  )

  await trx.wait()

  const newnameAvailable = await ethControllerContract.available(name)
  console.log('name available: ', newnameAvailable)

  // Wrap name ---

  const baseRegistrar = await hre.ethers.getContractAt(
    'BaseRegistrarImplementation',
    registrarAddress,
    signer,
  )
  const namehash =
    '0xc30c7c8c16adfbd5df69a066e85938d73b485946399f6938c9c5d0d342400010'

  await baseRegistrar.setApprovalForAll(nameWrapperAddress, true, {
    gasLimit: 10000000,
  })

  const nameWrapperContract = await hre.ethers.getContractAt(
    'NameWrapper',
    nameWrapperAddress,
    signer,
  )

  await nameWrapperContract.wrapETH2LD(name, deployer, 0, constants.AddressZero)

  console.log('getFuses: ', await nameWrapperContract.getFuses(namehash))
}

export default func
