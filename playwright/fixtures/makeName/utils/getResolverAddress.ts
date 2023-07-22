import { match } from 'ts-pattern'

import { RESOLVER_ADDRESSES } from '@app/utils/constants'

type Resolver = `0x${string}` | 'latest' | 'latest-legacy'

export const getResolverAddress = (resolver: Resolver) =>
  match(resolver)
    .with('latest', () => RESOLVER_ADDRESSES[0])
    .with('latest-legacy', () => RESOLVER_ADDRESSES[2])
    .otherwise(() => resolver)
