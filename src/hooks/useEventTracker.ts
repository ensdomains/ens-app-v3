import { match, P } from 'ts-pattern'
import { formatUnits } from 'viem'

import { PaymentMethod } from '@app/components/pages/profile/[name]/registration/types'
import { trackEvent as sendTrackEvent } from '@app/utils/analytics'
import useUserConfig from '@app/utils/useUserConfig'

import { useChainName } from './chain/useChainName'

type SearchSelectEvent = {
  eventName: 'search_selected_eth' | 'search_selected_box' | 'search_selected_dns'
  customProperties: { name: string }
}

type PaymentEvent = {
  eventName: 'payment_selected'
  customProperties: {
    ethPrice: bigint
    duration: number
    estimatedTotal: bigint
    paymentMethod: PaymentMethod | ''
  }
}

type DNSImportTypeEvent = {
  eventName: 'import_type_selected_dns'
  customProperties: {
    importType: 'onchain' | 'offchain' | null
    name: string
  }
}

type DefaultEvent = {
  eventName:
    | 'commit_started'
    | 'commit_wallet_opened'
    | 'register_started'
    | 'register_started_box'
    | 'register_wallet_opened'
    | 'verify_ownership_started_dns'
    | 'claim_domain_started_dns'
    | 'commit_wallet_opened_dns'
    | 'register_started_dns'
    | 'register_wallet_opened_dns'
  customProperties?: never
}

export type TrackEventParameters =
  | SearchSelectEvent
  | PaymentEvent
  | DefaultEvent
  | DNSImportTypeEvent

export const useEventTracker = () => {
  const chain = useChainName()
  const { userConfig } = useUserConfig()

  const trackEvent = (props: TrackEventParameters) => {
    match(props)
      .with(
        {
          eventName: P.union('search_selected_eth', 'search_selected_box', 'search_selected_dns'),
        },
        ({ eventName, customProperties }) => {
          const { name } = customProperties
          sendTrackEvent(eventName, chain, { name })
        },
      )
      .with(
        {
          eventName: P.union(
            'commit_started',
            'commit_wallet_opened',
            'register_started',
            'register_started_box',
            'register_wallet_opened',
            'verify_ownership_started_dns',
            'claim_domain_started_dns',
            'commit_wallet_opened_dns',
            'register_started_dns',
            'register_wallet_opened_dns',
          ),
        },
        ({ eventName }) => sendTrackEvent(eventName, chain),
      )
      .with({ eventName: 'payment_selected' }, ({ eventName, customProperties }) => {
        const { duration, ethPrice, estimatedTotal, paymentMethod } = customProperties
        const paymentAmount = formatUnits((estimatedTotal * ethPrice) / BigInt(1e8), 18)
        const currencyUnit = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'
        const paymentType = paymentMethod === PaymentMethod.ethereum ? 'eth' : 'fiat'

        sendTrackEvent(eventName, chain, {
          duration,
          currencyUnit,
          paymentType,
          paymentAmount,
        })
      })
      .with(
        {
          eventName: P.union('import_type_selected_dns'),
        },
        ({ eventName, customProperties }) => {
          const { importType, name } = customProperties
          sendTrackEvent(eventName, chain, { name, importType })
        },
      )
      .exhaustive()
  }

  return {
    trackEvent,
  }
}
