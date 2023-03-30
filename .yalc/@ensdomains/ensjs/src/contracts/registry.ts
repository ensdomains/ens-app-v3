import type { JsonRpcProvider } from '@ethersproject/providers'
import { ENSRegistry__factory } from '../generated/factories/ENSRegistry__factory'

export default (provider: JsonRpcProvider, address: string) =>
  ENSRegistry__factory.connect(address, provider)
