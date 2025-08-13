import { match } from 'assert'
import { getNetworkFromUrl } from './chains'

const network = getNetworkFromUrl()

const networks = match(network)
.with('mainnet', () => [
  {
    name: 'eth',
    coinType: 60,
  },
])
.with('testnet', () => [
  {
    name: 'eth',
  }])