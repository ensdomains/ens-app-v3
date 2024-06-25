/* eslint-disable import/no-extraneous-dependencies */
import { writeFile } from 'fs/promises'
import { resolve } from 'path'

import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const allDeployments = await hre.deployments.all()
  const deploymentAddressArray = Object.keys(allDeployments).map((dkey) => [
    dkey,
    allDeployments[dkey].address,
  ])
  const deploymentAddressMap = Object.fromEntries(deploymentAddressArray)

  await writeFile(
    resolve(__dirname, '../.env.local'),
    `NEXT_PUBLIC_DEPLOYMENT_ADDRESSES='${JSON.stringify(deploymentAddressMap)}'`,
  )
  await writeFile(
    resolve(__dirname, '../src/constants/generatedContracts.ts'),
    `export const deploymentAddresses = {
  ${deploymentAddressArray.map(([name, address]) => `${name}: '${address}',`).join('\n  ')}
} as const
`,
  )
  console.log('Wrote contract addresses to .env.local')
}

func.runAtTheEnd = true

export default func
