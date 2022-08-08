/* eslint-disable import/no-extraneous-dependencies */
import { existsSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import fetch from 'node-fetch-commonjs'
import { resolve } from 'path'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()

  let contractJson: any

  const nodePaths = process.env.NODE_PATH!.split(':')
  const nodePath = nodePaths[nodePaths.length - 1]

  console.log(`nodePath: ${nodePath}`)
  console.log('env', process.env)

  const jsonPath = resolve(nodePath, '../../../', './cache/multicall.json')

  if (existsSync(jsonPath)) {
    console.log('Multicall JSON file found, using it...')
    contractJson = JSON.parse(await readFile(jsonPath, { encoding: 'utf8' }))
  } else {
    console.log('Downloading Multicall JSON file...')
    contractJson = await fetch(
      'https://github.com/mds1/multicall/releases/latest/download/Multicall3.json',
    ).then((res) => res.json())
    await writeFile(jsonPath, JSON.stringify(contractJson))
  }

  await hre.deployments.deploy('Multicall', {
    from: deployer,
    contract: contractJson,
  })
}

func.id = 'multicall'

export default func
