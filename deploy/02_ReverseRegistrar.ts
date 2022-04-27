/* eslint-disable import/extensions */
import { ENSRegistry__factory } from '@ensdomains/ensjs/dist/cjs/generated/factories/ENSRegistry__factory'
import { Root__factory } from '@ensdomains/ensjs/dist/cjs/generated/factories/Root__factory'
import { namehash, solidityKeccak256 } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const registryAddress = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'

  ethers.provider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545',
  )

  const root = Root__factory.connect(
    '0x31e789Eb325aB116997942f7809731197a3dc059',
    ethers.provider.getSigner('0xa303ddC620aa7d1390BACcc8A495508B183fab59'),
  )

  const registry = ENSRegistry__factory.connect(
    registryAddress,
    ethers.provider.getSigner('0xa303ddC620aa7d1390BACcc8A495508B183fab59'),
  )

  await deploy('ReverseRegistrar', {
    from: deployer,
    args: [registryAddress],
  })

  const reverseRegistrarAddress = (await deployments.get('ReverseRegistrar'))
    .address

  const tx1 = await root.setSubnodeOwner(
    solidityKeccak256(['string'], ['reverse']),
    '0xa303ddC620aa7d1390BACcc8A495508B183fab59',
    {
      from: '0xa303ddC620aa7d1390BACcc8A495508B183fab59',
    },
  )

  await tx1?.wait()

  const tx = await registry.setSubnodeOwner(
    namehash('reverse'),
    solidityKeccak256(['string'], ['addr']),
    reverseRegistrarAddress,
    {
      from: '0xa303ddC620aa7d1390BACcc8A495508B183fab59',
    },
  )

  await tx?.wait()

  console.log(
    'Deployed ReverseRegistrar, address:',
    (await deployments.get('ReverseRegistrar')).address,
  )
}

export default func
