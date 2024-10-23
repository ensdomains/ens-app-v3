import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import type { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'

import { createPersistConfig } from './persist'
import { queryClient } from './reactQuery'
import { wagmiConfig } from './wagmi'

type Props = {
  children: ReactNode
}

export function QueryProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={typeof window !== 'undefined'}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={createPersistConfig({ queryClient })}
      >
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}
