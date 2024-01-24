import type { GetPublicClientArgs } from '@wagmi/core'
import { usePublicClient as usePublicClient_ } from 'wagmi'

import { PublicClientWithChain } from '@app/types'

export const usePublicClient = usePublicClient_ as <
  TPublicClient extends PublicClientWithChain = PublicClientWithChain,
>(
  args?: Partial<GetPublicClientArgs>,
) => TPublicClient
