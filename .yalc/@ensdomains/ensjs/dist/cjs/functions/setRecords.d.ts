import { ethers } from 'ethers'
import { ENSArgs } from '..'
declare type RecordItem = {
  key: string
  value: string
}
declare type RecordOptions = {
  contentHash?: string
  texts?: RecordItem[]
  coinTypes?: RecordItem[]
}
export default function (
  {
    contracts,
    provider,
    getResolver,
  }: ENSArgs<'contracts' | 'provider' | 'getResolver'>,
  name: string,
  records: RecordOptions,
): Promise<ethers.ContractTransaction | undefined>
export {}
