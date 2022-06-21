/* eslint-disable import/extensions */
import { ENSRegistry__factory } from '@ensdomains/ensjs/dist/cjs/generated/factories/ENSRegistry__factory'
import { Root__factory } from '@ensdomains/ensjs/dist/cjs/generated/factories/Root__factory'
import { namehash, solidityKeccak256 } from 'ethers/lib/utils'
import { ethers as _ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { deployContract, setEthersProvider } from './.utils'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const ethers = setEthersProvider(_ethers)

  const { deployments, getNamedAccounts } = hre

  const { deployer } = await getNamedAccounts()

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

  const root = Root__factory.connect(
    '0x31e789Eb325aB116997942f7809731197a3dc059',
    ethers.provider.getSigner(deployer),
  )

  const registry = ENSRegistry__factory.connect(
    registryAddress,
    ethers.provider.getSigner(deployer),
  )

  const ReverseRegistrar = await deployContract(
    'ReverseRegistrar',
    registryAddress,
  )

  const reverseRegistrarAddress = ReverseRegistrar.address

  console.log(
    'ReverseRegistrar:',
    'Deployed with address',
    reverseRegistrarAddress,
  )

  const tx1 = await root.setSubnodeOwner(
    solidityKeccak256(['string'], ['reverse']),
    deployer,
    {
      from: deployer,
    },
  )

  await tx1?.wait()

  console.log('ReverseRegistrar:', 'Set owner of reverse subnode to deployer')

  const tx = await registry.setSubnodeOwner(
    namehash('reverse'),
    solidityKeccak256(['string'], ['addr']),
    reverseRegistrarAddress,
    {
      from: deployer,
    },
  )

  await tx?.wait()

  console.log(
    'ReverseRegistrar:',
    'Set owner of addr.reverse subnode to ReverseRegistrar',
  )
}

export default func
