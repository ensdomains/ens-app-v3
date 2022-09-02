/* eslint-disable import/no-extraneous-dependencies */
import { writeFile } from 'fs/promises'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { resolve } from 'path'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const allDeployments = await hre.deployments.all()
  const deploymentAddressMap = Object.fromEntries(
    Object.keys(allDeployments).map((dkey) => [dkey, allDeployments[dkey].address]),
  )

  await writeFile(
    resolve(__dirname, '../.env.local'),
    `NEXT_PUBLIC_DEPLOYMENT_ADDRESSES='${JSON.stringify(deploymentAddressMap)}'`,
  )
  console.log('Wrote contract addresses to .env.local')

  await hre.ethers.provider.send('evm_setNextBlockTimestamp', [Date.now() / 1000])
  await hre.ethers.provider.send('evm_mine', [])
  await hre.ethers.provider.send('evm_snapshot', [])
}

func.runAtTheEnd = true

export default func
