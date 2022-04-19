import '@nomiclabs/hardhat-ethers'
import 'dotenv/config'
import 'hardhat-dependency-compiler'
import 'hardhat-deploy'
import { HardhatUserConfig } from 'hardhat/config'

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
    localhost: {
      saveDeployments: false,
      url: 'http://localhost:8545',
      chainId: parseInt(process.env.CHAIN_ID!),
      accounts: {
        mnemonic: process.env.SECRET_WORDS!,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
  },
}

export default config
