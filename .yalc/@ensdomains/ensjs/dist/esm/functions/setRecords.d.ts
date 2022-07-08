import { ENSArgs } from '..';
import { RecordOptions } from '../utils/recordHelpers';
export default function ({ contracts, provider, getResolver, }: ENSArgs<'contracts' | 'provider' | 'getResolver'>, name: string, records: RecordOptions): Promise<import("ethers").ContractTransaction | undefined>;
