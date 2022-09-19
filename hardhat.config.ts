import '@nomiclabs/hardhat-ethers'
import 'dotenv/config'
import 'hardhat-deploy'
import { resolve } from 'path'

const ensContractsPath = './node_modules/@ensdomains/ens-contracts'
BigInt.prototype.toJSON = function () {
  return this.toString()
}

const config = {
  tenderly: {
    project: 'core',
  },
  solidity: {
    compilers: [
      {
        version: '0.8.13',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {
      saveDeployments: false,
      // chainId: parseInt(process.env.CHAIN_ID),
      accounts: {
        mnemonic: process.env.SECRET_WORDS,
      },
      live: false,
      tags: ['test', 'legacy', 'use_root'],
      chainId: 1337,
    },
    localhost: {
      saveDeployments: false,
      url: process.env.RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID),
      accounts: {
        mnemonic: process.env.SECRET_WORDS,
      },
      live: false,
      tags: ['test', 'legacy', 'use_root'],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 1,
    },
  },
  external: {
    contracts: [
      {
        artifacts: [
          resolve(ensContractsPath, 'artifacts'),
          resolve(ensContractsPath, './deployments/archive'),
        ],
        deploy: resolve(ensContractsPath, './build/deploy'),
      },
    ],
  },
}

export default config
