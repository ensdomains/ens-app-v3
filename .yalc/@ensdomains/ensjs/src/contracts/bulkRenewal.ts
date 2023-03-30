import type { JsonRpcProvider } from '@ethersproject/providers'
import { BulkRenewal__factory } from '../generated/factories/BulkRenewal__factory'

// Use a higher-order function to override the address that is passed in from getContractAddress()
export default (provider: JsonRpcProvider, address: string) =>
  BulkRenewal__factory.connect(address, provider)
