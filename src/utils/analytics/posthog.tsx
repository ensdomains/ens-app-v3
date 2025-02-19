import { Router } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import { ReactNode, useEffect } from 'react'
import { useAccountEffect } from 'wagmi'

import { sendEvent } from './events'

export const PostHogProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      return
    }

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
      // Enable debug mode in development
      loaded: (posthogInstance) => {
        if (process.env.NODE_ENV === 'development') posthogInstance.debug()
      },
    })

    const handleRouteChange = () => posthog?.capture('$pageview')

    Router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  useAccountEffect({
    onConnect(data) {
      posthog.identify(
        data.address,
        {
          address: data.address,
        },
        {
          initial_address: data.address,
        },
      )

      posthog.register({
        chain_id: data.chainId,
      })

      sendEvent('wallet:connect', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_address: data.address,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        chain_id: data.chainId,
        wallet_connector: data.connector.name,
      })
    },
    onDisconnect() {
      sendEvent('wallet:disconnect')
      posthog.reset()
    },
  })

  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>
}
