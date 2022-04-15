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
  const universalResolverAddress = '0x9e6c745CAEdA0AB8a7AD0f393ef90dcb7C70074A'

  const address = server.provider.getInitialAccounts()
  const provider = new ethers.providers.Web3Provider(server.provider)
  const deployer = provider.getSigner(Object.keys(address)[0])

  console.log('Deploying DNCOCURP with account:', deployer._address)

  const CompiledDNCOCURP = await compile(
    'DoNotCallOnChainUniversalResolverProxy',
    'utils/',
  )

  const DNCOCURP = ethers.ContractFactory.fromSolidity(
    CompiledDNCOCURP,
    deployer,
  )

  const DNCOCURPAddress = await deployContract(DNCOCURP, [
    universalResolverAddress,
  ])
  console.log('DNCOCURP Address:', DNCOCURPAddress)
  return
}
