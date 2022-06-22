import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const { user } = await getNamedAccounts()

  const DAYS = 24 * 60 * 60

  const name = 'wrapmebaby'
  const secret =
    '0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF'
  const duration = 365 * DAYS

  const signer = ethers.provider.getSigner(user)

  const ethRegistrarController = await ethers.getContract(
    'ETHRegistrarController',
    signer,
  )

  const publicResolverAddress = (await deployments.get('PublicResolver'))
    .address

  const registrationData = [
    name,
    user,
    duration,
    secret,
    publicResolverAddress,
    [],
    false,
    0,
  ]

  const commitment = await ethRegistrarController.makeCommitment(
    ...registrationData,
  )

  const rentPrice = await ethRegistrarController.rentPrice(name, duration)

  const commitTx = await ethRegistrarController.commit(commitment)

  await commitTx.wait()

  console.log('WrapName:', 'Commited name commitment')

  const timeToIncrease =
    (await ethRegistrarController.minCommitmentAge()).toNumber() + 1

  await ethers.provider.send('evm_increaseTime', [timeToIncrease])

  console.log('WrapName:', 'Increased time by', timeToIncrease, 'seconds')

  await ethers.provider.send('evm_mine', [])

  console.log('WrapName:', 'Mined block to set time increase')

  const registerTx = await ethRegistrarController.register(
    ...registrationData,
    {
      value: rentPrice[0],
    },
  )

  await registerTx.wait()

  console.log('WrapName:', 'Registered wrapped name', `${name}.eth`)
}

export default func
