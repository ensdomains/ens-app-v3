/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs/promises'
import { resolve } from 'path'

import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { getAddress, namehash } from 'viem'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, viem } = hre
  const allNamedAccts = await getNamedAccounts()
  const { deployer } = allNamedAccts
  const { owner } = await viem.getNamedClients()

  const registry = await viem.getContract('ENSRegistry')
  const nameWrapper = await viem.getContract('NameWrapper')
  const ethController = await viem.getContract('ETHRegistrarController')
  const reverseRegistrar = await viem.getContract('ReverseRegistrar')
  const publicResolver = await viem.getContract('PublicResolver')

  await deployments.deploy('OutdatedResolver', {
    from: deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/OutdatedResolverV1.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address],
  })

  await deployments.deploy('CustomOutdatedResolver', {
    from: deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/OutdatedResolverV3.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address],
  })

  await deployments.deploy('CustomLegacyResolver', {
    from: deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/CustomLegacyResolver.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address],
  })

  await deployments.deploy('CustomNameWrapperAwareResolver', {
    from: deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/CustomNameWrapperAwareResolver.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address, nameWrapper.address, ethController.address, reverseRegistrar.address],
  })

  const spoofCompositeResolver = await deployments.deploy('SpoofCompositeResolver', {
    from: deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/SpoofCompositeResolver.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [publicResolver.address],
  })
  const spoofCompositeResolverAddress = getAddress(spoofCompositeResolver.address)

  // The name is registered with the default resolver before runAtTheEnd fixtures execute.
  const setResolverTxHash = await registry.write.setResolver(
    [namehash('spoofcompositeresolver.eth'), spoofCompositeResolverAddress],
    {
      account: owner.account,
    },
  )
  console.log(
    `Setting resolver for spoofcompositeresolver.eth to ${spoofCompositeResolverAddress} (tx: ${setResolverTxHash})...`,
  )
  await viem.waitForTransactionSuccess(setResolverTxHash)

  console.log('Finished deploying legacy resolvers')

  return true
}

func.id = 'deploy-legacy-resolvers'
func.tags = ['deploy-legacy-resolvers']
func.runAtTheEnd = true

export default func
