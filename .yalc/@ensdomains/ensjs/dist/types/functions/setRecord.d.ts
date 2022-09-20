import { ENSArgs } from '..';
import { RecordInput } from '../utils/recordHelpers';
declare type BaseInput = {
    resolverAddress?: string;
};
declare type ContentHashInput = {
    record: RecordInput<'contentHash'>;
    type: 'contentHash';
};
declare type AddrOrTextInput = {
    record: RecordInput<'addr' | 'text'>;
    type: 'addr' | 'text';
};
export default function ({ contracts, provider, getResolver, signer, }: ENSArgs<'contracts' | 'provider' | 'getResolver' | 'signer'>, name: string, { record, type, resolverAddress, }: BaseInput & (ContentHashInput | AddrOrTextInput)): Promise<{
    to: string;
    data: string;
}>;
export {};
