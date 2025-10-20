import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { DeployFunction } from 'hardhat-deploy/dist/types'
import { isAddress } from 'viem'

const func: DeployFunction = async (hre) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  // Load the WrappedEthRegistrarController artifact
  const controllerJson = JSON.parse(
    await readFile(resolve(__dirname, '.contracts/NameWrapperEthRegistrarController.json'), {
      encoding: 'utf8',
    }),
  )

  // Load the NameWrapperPublicResolver artifact
  const resolverJson = JSON.parse(
    await readFile(resolve(__dirname, '.contracts/NameWrapperPublicResolver.json'), {
      encoding: 'utf8',
    }),
  )

  // Get deployed contract addresses for constructor arguments
  const baseRegistrar = await deployments.get('BaseRegistrarImplementation')
  const priceOracle = await deployments.get('ExponentialPremiumPriceOracle')
  const reverseRegistrar = await deployments.get('ReverseRegistrar')
  const nameWrapper = await deployments.get('NameWrapper')
  const registry = await deployments.get('ENSRegistry')

  console.log('Deploying WrappedEthRegistrarController...')

  // Deploy the controller with the correct 7 constructor arguments
  const controller = await deploy('WrappedEthRegistrarController', {
    from: deployer,
    args: [
      baseRegistrar.address, // BaseRegistrarImplementation address
      priceOracle.address, // IPriceOracle address
      60n, // Min commitment age (60 seconds = 1 minute)
      86400n, // Max commitment age (86400 seconds = 24 hours)
      reverseRegistrar.address, // ReverseRegistrar address
      nameWrapper.address, // INameWrapper address (6th parameter)
      registry.address, // ENS registry address (7th parameter)
    ],
    log: true,
    contract: controllerJson,
  })

  if (!isAddress(controller.address)) {
    throw new Error('Controller address is not a valid address')
  }

  console.log(`WrappedEthRegistrarController deployed at: ${controller.address}`)

  console.log('Deploying NameWrapperPublicResolver...')

  // Deploy the resolver with 4 constructor arguments
  const resolverDeployment = await deploy('NameWrapperPublicResolver', {
    from: deployer,
    args: [
      registry.address, // ENS registry address
      nameWrapper.address, // INameWrapper address
      controller.address, // Trusted ETH Controller address
      reverseRegistrar.address, // Trusted Reverse Registrar address
    ],
    log: true,
    contract: resolverJson,
  })

  console.log(`NameWrapperPublicResolver deployed at: ${resolverDeployment.address}`)

  // Set up controller permissions after deployment
  if (controller.newlyDeployed) {
    const { viem } = hre
    const allNamedAccts = await getNamedAccounts()
    const { owner } = allNamedAccts // Get the owner account

    if (!isAddress(owner)) {
      throw new Error('Owner address is not a valid address')
    }

    console.log('Setting up controller permissions...')

    // Get contract instances with owner as the signer
    const baseRegistrarContract = await viem.getContract('BaseRegistrarImplementation')
    const nameWrapperContract = await viem.getContract('NameWrapper')
    const reverseRegistrarContract = await viem.getContract('ReverseRegistrar')

    // 1. Add as controller on BaseRegistrarImplementation (from owner account)
    const addControllerTx = await baseRegistrarContract.write.addController([controller.address], {
      account: owner,
    })
    console.log(`Added as controller on BaseRegistrarImplementation (tx: ${addControllerTx})`)
    await viem.waitForTransactionSuccess(addControllerTx)

    // 2. Add as controller on NameWrapper (from owner account)
    const setNameWrapperControllerTx = await nameWrapperContract.write.setController(
      [controller.address, true],
      {
        account: owner,
      },
    )
    console.log(`Added as controller on NameWrapper (tx: ${setNameWrapperControllerTx})`)
    await viem.waitForTransactionSuccess(setNameWrapperControllerTx)

    // 3. Add as controller on ReverseRegistrar (from owner account)
    const setReverseControllerTx = await reverseRegistrarContract.write.setController(
      [controller.address, true],
      {
        account: owner,
      },
    )
    console.log(`Added as controller on ReverseRegistrar (tx: ${setReverseControllerTx})`)
    await viem.waitForTransactionSuccess(setReverseControllerTx)
  }

  return true
}

func.id = 'WrappedEthRegistrarController_and_Resolver'
func.tags = ['WrappedEthRegistrarController', 'NameWrapperPublicResolver']
func.dependencies = [
  'ENSRegistry',
  'BaseRegistrarImplementation',
  'NameWrapper',
  'ReverseRegistrar',
  'ExponentialPremiumPriceOracle',
]

export default func
