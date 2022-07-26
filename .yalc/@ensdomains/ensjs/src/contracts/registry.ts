import { ethers } from 'ethers'
import { ENSRegistry__factory } from '../generated/factories/ENSRegistry__factory'

export default (provider: ethers.providers.JsonRpcProvider, address: string) =>
  ENSRegistry__factory.connect(address, provider)
