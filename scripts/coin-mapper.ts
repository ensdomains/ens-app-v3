import fs, { writeFileSync } from 'fs'
import { resolve } from 'path'

import { extractChain } from 'viem'
import * as chains from 'viem/chains'

import { CoinName, coinNameToTypeMap } from '@ensdomains/address-encoder'
import { coinTypeToEvmChainId, isEvmCoinType } from '@ensdomains/address-encoder/utils'

import { supportedAddresses } from '../src/constants/supportedAddresses'

const allCoins = JSON.parse(fs.readFileSync('./src/constants/allCoins.json', 'utf8'))
const supportedBlockExplorersFile = resolve(
  __dirname,
  '../src/constants/blockExplorers/supported.json',
)
const blockExplorerEvmFile = resolve(__dirname, '../src/constants/blockExplorers/evm.json')
const othersBlockExplorerFile = resolve(__dirname, '../src/constants/blockExplorers/other.json')

const supportedCoins = supportedAddresses.filter(
  (address: string) =>
    allCoins.includes(address) && !Number.isNaN(coinNameToTypeMap[address as CoinName]),
)
const evmCoins = allCoins.filter((address: string) =>
  isEvmCoinType(coinNameToTypeMap[address as CoinName]),
)

const btcBlockExplorer = {
  name: 'Bitcoin',
  nativeCurrency: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
  },
  blockExplorers: {
    default: {
      name: 'Blockchair',
      url: 'https://blockchair.com/bitcoin',
    },
  },
}

const solBlockExplorer = {
  name: 'Solana',
  nativeCurrency: {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
  },
  blockExplorers: {
    default: {
      name: 'Solana',
      url: 'https://explorer.solana.com/',
    },
  },
}

// convert these into objects
const supportedBlockExplorers = supportedCoins.map((coinName: string) => {
  const coinType = coinNameToTypeMap[coinName as CoinName]
  if (coinName === 'btc')
    return {
      [coinName]: { ...btcBlockExplorer },
    }
  if (coinName === 'sol')
    return {
      [coinName]: { ...solBlockExplorer },
    }

  // Ethereum mainnet is 60, but we need to convert it to 1
  const coinId = coinType === 60 ? 1 : coinTypeToEvmChainId(coinType)
  const coin = extractChain({
    chains: Object.values(chains),
    id: coinId,
  })
  if (!coin) return {}
  return {
    [coinName]: {
      id: coin?.id,
      name: coin?.name,
      nativeCurrency: {
        ...coin?.nativeCurrency,
      },
      blockExplorers: {
        ...coin?.blockExplorers,
      },
    },
  }
})

const evmBlockExplorers = evmCoins.map((coinName: string) => {
  const coinType = coinNameToTypeMap[coinName as CoinName]
  // Ethereum mainnet is 60, but we need to convert it to 1
  const coinId = coinType === 60 ? 1 : coinTypeToEvmChainId(coinType)
  const coin = extractChain({
    chains: Object.values(chains),
    id: coinId,
  })
  if (!coin) return {}
  return {
    [coinName]: {
      id: coin?.id,
      name: coin?.name,
      nativeCurrency: {
        ...coin?.nativeCurrency,
      },
      blockExplorers: {
        ...coin?.blockExplorers,
      },
    },
  }
})

writeFileSync(
  supportedBlockExplorersFile,
  JSON.stringify(Object.assign({}, ...supportedBlockExplorers)),
)
writeFileSync(blockExplorerEvmFile, JSON.stringify(Object.assign({}, ...evmBlockExplorers)))
writeFileSync(othersBlockExplorerFile, JSON.stringify({}))
