import { deployments, ethers } from 'hardhat'
import { DeploymentSubmission } from 'hardhat-deploy/types'

ethers.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')

export const setEthersProvider = (_ethers: typeof ethers) => {
  // eslint-disable-next-line no-param-reassign
  _ethers.provider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545',
  )

  return _ethers
}

export const deployContract = async (name: string, ...args: any[]) => {
  const signer = await ethers.getNamedSigner('deployer')

  const contract = await ethers.getContractFactory(name, signer)

  const deployment = await contract.deploy(...args)

  await deployment.deployed()

  const receipt = await deployment.deployTransaction.wait()

  const deploymentInfo: DeploymentSubmission = {
    ...(await deployments.getExtendedArtifact(name)),
    transactionHash: deployment.deployTransaction.hash,
    args,
    address: deployment.address,
    receipt,
  }

  await deployments.save(name, deploymentInfo)

  return deployment
}
