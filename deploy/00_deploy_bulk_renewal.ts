/* eslint-disable import/no-extraneous-dependencies */
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { Abi, AbiFunction, bytesToHex, hexToBytes, labelhash, namehash, toFunctionHash } from 'viem'

const createInterfaceId = <I extends Abi>(iface: I) => {
  const bytesId = iface
    .filter((item): item is AbiFunction => item.type === 'function')
    .map((f) => toFunctionHash(f))
    .map((h) => hexToBytes(h).slice(0, 4))
    .reduce((memo, bytes) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-bitwise, no-param-reassign
        memo[i] ^= bytes[i] // xor
      }
      return memo
    }, new Uint8Array(4))

  return bytesToHex(bytesId)
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, network, viem } = hre

  if (!network.tags.use_root) {
    return true
  }

  const { owner, deployer } = await viem.getNamedClients()

  const root = await viem.getContract('Root', owner)
  const registry = await viem.getContract('ENSRegistry', owner)
  const resolver = await viem.getContract('PublicResolver', owner)
  const registrar = await viem.getContract('BaseRegistrarImplementation')
  const controller = await viem.getContract('ETHRegistrarController')
  const wrapper = await viem.getContract('NameWrapper')
  const controllerArtifact = (await deployments.getArtifact('IETHRegistrarController'))!

  const bulkRenewal = await viem.deployContract('BulkRenewal', [registry.address], {
    client: deployer,
  })

  console.log('Temporarily setting owner of eth tld to owner ')
  await root.write.setSubnodeOwner([labelhash('eth')], { chain: undefined, account: owner.account })

  console.log('Set default resolver for eth tld to public resolver')
  await registry.write.setResolver([namehash('eth'), resolver.address], {
    chain: undefined,
    account: owner.account,
  })

  console.log('Set interface implementor of eth tld for bulk renewal')
  await resolver.write.setInterface(
    [namehash('eth'), createInterfaceId(bulkRenewal.abi), bulkRenewal.address],
    { chain: undefined, account: owner.account },
  )

  console.log('Set interface implementor of eth tld for registrar controller')
  await resolver.write.setInterface(
    [namehash('eth'), createInterfaceId(controllerArtifact.abi), controller.address],
    { chain: undefined, account: owner.account },
  )

  console.log('Set interface implementor of eth tld for name wrapper')
  await resolver.write.setInterface(
    [namehash('eth'), createInterfaceId(wrapper.abi), wrapper.address],
    { chain: undefined, account: owner.account },
  )

  console.log('Set owner of eth tld back to registrar')
  await root.write.setSubnodeOwner([labelhash('eth'), registrar.address], {
    chain: undefined,
    account: owner.account,
  })

  return true
}

func.id = 'bulk-renewal'
func.tags = ['ethregistrar', 'BulkRenewal']
func.dependencies = [
  'root',
  'registry',
  'BaseRegistrarImplementation',
  'PublicResolver',
  'ETHRegistrarController',
]

export default func
