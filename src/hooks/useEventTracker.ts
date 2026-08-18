import { match, P } from 'ts-pattern'

import { trackEvent as sendTrackEvent } from '@app/utils/analytics'

import { useChainName } from './chain/useChainName'

type SearchSelectEvent = {
  eventName: 'search_selected_eth' | 'search_selected_dns'
  customProperties: { name: string }
}

type DNSImportTypeSelectedEvent = {
  eventName:
    | 'dns_selected_import_type'
    | 'dns_sec_enabled'
    | 'dns_verified_ownership'
    | 'dns_claim_started'
    | 'dns_claimed'
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
    | 'register_wallet_opened'
    | 'claim_domain_started_dns'
    | 'commit_wallet_opened_dns'
    | 'register_started_dns'
    | 'register_wallet_opened_dns'
    | 'register_override_triggered'
    | 'dns_approve_registrar_wallet_opened'
    | 'dns_import_wallet_opened'
    | 'dns_claim_wallet_opened'
  customProperties?: never
}

export type TrackEventParameters = SearchSelectEvent | DefaultEvent | DNSImportTypeSelectedEvent

export const useEventTracker = () => {
  const chain = useChainName()

  const trackEvent = (props: TrackEventParameters) => {
    match(props)
      .with(
        {
          eventName: P.union('search_selected_eth', 'search_selected_dns'),
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
            'register_wallet_opened',
            'claim_domain_started_dns',
            'commit_wallet_opened_dns',
            'register_started_dns',
            'register_wallet_opened_dns',
            'register_override_triggered',
            'dns_approve_registrar_wallet_opened',
            'dns_import_wallet_opened',
            'dns_claim_wallet_opened',
          ),
        },
        ({ eventName }) => sendTrackEvent(eventName, chain),
      )
      .with(
        {
          eventName: P.union(
            'dns_selected_import_type',
            'dns_sec_enabled',
            'dns_verified_ownership',
            'dns_claim_started',
            'dns_claimed',
          ),
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
