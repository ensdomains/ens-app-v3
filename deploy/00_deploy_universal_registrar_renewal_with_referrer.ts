import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { DeployFunction } from 'hardhat-deploy/dist/types'
import { isAddress } from 'viem'

const func: DeployFunction = async (hre) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  // Load the UniversalRegistrarRenewalWithReferrer artifact
  const renewalJson = JSON.parse(
    await readFile(resolve(__dirname, '.contracts/UniversalRegistrarRenewalWithReferrer.json'), {
      encoding: 'utf8',
    }),
  )

  // Get deployed contract addresses for constructor arguments
  const registry = await deployments.get('ENSRegistry')
  const wrappedController = await deployments.get('WrappedEthRegistrarController')

  console.log('Deploying UniversalRegistrarRenewalWithReferrer...')

  // Deploy the contract with the correct 2 constructor arguments
  const renewal = await deploy('UniversalRegistrarRenewalWithReferrer', {
    from: deployer,
    args: [
      registry.address, // ENS registry address
      wrappedController.address, // IWrappedEthRegistrarController address
    ],
    log: true,
    contract: renewalJson,
  })

  if (!isAddress(renewal.address)) {
    throw new Error('UniversalRegistrarRenewalWithReferrer address is not a valid address')
  }

  console.log(`UniversalRegistrarRenewalWithReferrer deployed at: ${renewal.address}`)

  return true
}

func.id = 'UniversalRegistrarRenewalWithReferrer'
func.tags = ['UniversalRegistrarRenewalWithReferrer']
func.dependencies = ['ENSRegistry', 'WrappedEthRegistrarController']

export default func
