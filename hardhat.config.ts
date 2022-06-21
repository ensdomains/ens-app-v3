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
      url: process.env.RPC_URL,
      chainId: parseInt(process.env.CHAIN_ID!),
      accounts: {
        mnemonic: process.env.SECRET_WORDS!,
      },
      live: false,
    },
  },
  namedAccounts: {
    deployer: {
      default: '0xa303ddC620aa7d1390BACcc8A495508B183fab59',
    },
    user: {
      default: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    },
  },
}

export default config
