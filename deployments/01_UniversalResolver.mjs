import { ethers } from 'ethers'
import fs from 'fs'
import nModule from 'module'
import path from 'path'
import solc from 'solc'

const pnp = nModule.findPnpApi('./')
const contracts = pnp.resolveToUnqualified(
  'ens-contracts-universal/contracts',
  './',
)

const findImports = (ogPath) => (filePath) => {
  let newPath = path.resolve(contracts, ogPath, './' + filePath)
  if (!fs.existsSync(newPath)) {
    newPath = path.resolve(contracts, ogPath, '../' + filePath)
  }
  if (!fs.existsSync(newPath)) {
    newPath = pnp.resolveToUnqualified(filePath, './')
  }
  return {
    contents: fs.readFileSync(newPath, 'utf8'),
  }
}

async function compile(name, inputPath) {
  const input = JSON.stringify({
    language: 'Solidity',
    sources: {
      [name]: {
        content: fs.readFileSync(
          path.resolve(contracts, inputPath + name + '.sol'),
          'utf8',
        ),
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  })
  const compiled = solc.compile(input, { import: findImports(inputPath) })
  const parsed = JSON.parse(compiled)
  return parsed.contracts[name][name]
}

const deployContract = async (InputContract, args) => {
  const deployment = await InputContract.deploy(...args, {
    gasLimit: 30000000,
  })
  await deployment.deployTransaction.wait()
  return deployment.address
}

export default async (server) => {
  const registryAddress = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e'

  const address = server.provider.getInitialAccounts()
  const provider = new ethers.providers.Web3Provider(server.provider)
  const deployer = provider.getSigner(Object.keys(address)[0])

  console.log('Deploying UniversalResolver with account:', deployer._address)

  const CompiledUniversalResolver = await compile('UniversalResolver', 'utils/')

  const UniversalResolver = ethers.ContractFactory.fromSolidity(
    CompiledUniversalResolver,
    deployer,
  )

  const universalResolverAddress = await deployContract(UniversalResolver, [
    registryAddress,
  ])
  console.log('Universal Resolver Address:', universalResolverAddress)
  return
}
