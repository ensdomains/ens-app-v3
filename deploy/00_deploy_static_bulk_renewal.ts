import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { DeployFunction } from 'hardhat-deploy/dist/types'
import { isAddress } from 'viem'

const func: DeployFunction = async (hre) => {
  const { getNamedAccounts, deployments } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  // Load the StaticBulkRenewal artifact
  const bulkRenewalJson = JSON.parse(
    await readFile(resolve(__dirname, '.contracts/StaticBulkRenewal.json'), {
      encoding: 'utf8',
    }),
  )

  // Get deployed contract addresses for constructor arguments
  const controller = await deployments.get('WrappedEthRegistrarController')

  console.log('Deploying StaticBulkRenewal...')

  // Deploy the contract with the ENS registry address as constructor argument
  const bulkRenewal = await deploy('WrappedStaticBulkRenewal', {
    from: deployer,
    args: [
      controller.address, // ENS registry address
    ],
    log: true,
    contract: bulkRenewalJson,
  })

  if (!isAddress(bulkRenewal.address)) {
    throw new Error('StaticBulkRenewal address is not a valid address')
  }

  console.log(`StaticBulkRenewal deployed at: ${bulkRenewal.address}`)

  return true
}

func.id = 'WrappedStaticBulkRenewal'
func.tags = ['WrappedStaticBulkRenewal']
func.dependencies = ['WrappedEthRegistrarController']

export default func
