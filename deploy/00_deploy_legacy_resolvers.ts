/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs/promises'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { resolve } from 'path'
import { namehash } from 'viem'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments } = hre
  const allNamedAccts = await getNamedAccounts()

  const registry = await ethers.getContract('ENSRegistry')

  await deployments.deploy('NoMulticallResolver', {
    from: allNamedAccts.deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/NoMulticallResolver.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address],
  })

  await deployments.deploy('OldResolver', {
    from: allNamedAccts.deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/OldResolver.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address],
  })

  await deployments.deploy('NoTextResolver', {
    from: allNamedAccts.deployer,
    contract: JSON.parse(
      await fs.readFile(resolve(__dirname, './.contracts/NoTextResolver.json'), {
        encoding: 'utf8',
      }),
    ),
    args: [registry.address],
  })
  // const resolver = await ethers.getContract('NoMulticallResolver')

  // for (const { namedOwner, name, addr } of names) {
  //   const owner = allNamedAccts[namedOwner]
  //   const _resolver = resolver.connect(await ethers.getSigner(owner))
  //   const _registry = registry.connect(await ethers.getSigner(owner))

  //   const tx = await _registry.setResolver(namehash(name), resolver.address)
  //   console.log(
  //     `Setting resolver for ${name} to ${resolver.address} (tx: ${tx.hash})...`,
  //   )
  //   await tx.wait()

  //   for (const { key, value } of addr) {
  //     const tx2 = await _resolver['setAddr(bytes32,uint256,bytes)'](
  //       namehash(name),
  //       key,
  //       value,
  //       {
  //         gasLimit: 100000,
  //       },
  //     )
  //     console.log(`Setting address for ${key} to ${value} (tx: ${tx.hash})...`)
  //     await tx2.wait()
  //   }
  // }

  return true
}

func.id = 'deploy-legacy-resolvers'
func.tags = ['deploy-legacy-resolvers']
func.runAtTheEnd = true

module.exports = func
