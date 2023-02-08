import { ENSArgs } from '..';
export default function ({ getOwner, provider }: ENSArgs<'getOwner' | 'provider'>, name: string): Promise<boolean>;
