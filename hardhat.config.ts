/* eslint-disable import/no-extraneous-dependencies */

import '@ensdomains/hardhat-toolbox-viem-extended'
import '@nomicfoundation/hardhat-viem'
import 'dotenv/config'
import 'hardhat-deploy'

import { resolve } from 'node:path'

import { HardhatUserConfig } from 'hardhat/config'

const ensContractsPath = './node_modules/@ensdomains/ens-contracts'

const config: HardhatUserConfig = {
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
      chainId: 1337,
      accounts: {
        mnemonic: process.env.SECRET_WORDS!,
      },
      live: false,
      tags: ['test', 'legacy', 'use_root'],
    },
    localhost: {
      saveDeployments: false,
      url: 'http://localhost:8545',
      chainId: 1337,
      accounts: {
        mnemonic: process.env.SECRET_WORDS!,
      },
      live: false,
      tags: ['test', 'legacy', 'use_root'],
    },
  },
  // namedAccounts: {
  //   deployer: {
  //     default: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  //   },
  // },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    owner: {
      default: 1,
    },
    owner2: {
      default: 2,
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
  paths: {
    artifacts: resolve(ensContractsPath, 'artifacts'),
  },
}

declare module '@nomicfoundation/hardhat-viem/types.js' {
  interface Register {
    config: typeof config
  }
}

export default config
