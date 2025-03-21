import posthog from 'posthog-js'
import { useEffect } from 'react'
import { useIntercom } from 'react-use-intercom'
import { useAccountEffect } from 'wagmi'

import { IS_DEV_ENVIRONMENT } from '@app/utils/constants'

export const useSetupIntercom = () => {
  const { boot, trackEvent, getVisitorId } = useIntercom()

  useEffect(() => {
    // Do not initialise with uid and email without implementing identity verification first
    if (!IS_DEV_ENVIRONMENT) {
      boot({
        customAttributes: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          posthog_id: posthog.get_distinct_id(),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          recent_replay: posthog.get_session_replay_url(),
        },
      })

      const visitorId = getVisitorId()
      if (visitorId) {
        posthog.capture('intercom:booted', undefined, {
          $set: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            intercom_id: visitorId,
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useAccountEffect({
    onConnect(data) {
      trackEvent('wallet:connect', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_address: data.address,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wallet_type: data.connector.name,
        chain: data.chain?.name ?? data.chainId,
      })
    },
    onDisconnect() {
      trackEvent('wallet:disconnect')
    },
  })
}
