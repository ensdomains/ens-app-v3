import { ethers } from 'ethers';
import { ENSArgs } from '..';
import { RecordOptions } from '../utils/recordHelpers';
export default function ({ contracts, provider, getResolver, }: ENSArgs<'contracts' | 'provider' | 'getResolver'>, name: string, records: RecordOptions): Promise<ethers.ContractTransaction | undefined>;
