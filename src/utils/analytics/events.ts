import posthog from 'posthog-js'

import { DnsImportType, DnsStep } from '@app/components/pages/import/[name]/useDnsImportReducer'
import {
  PaymentMethod,
  RegistrationStep,
} from '@app/components/pages/profile/[name]/registration/types'
import { ProfileRecord } from '@app/constants/profileRecordOptions'

export type EventDefs = {
  // Wallet events
  /**
   * Triggered when the wallet is programmatically opened
   */
  'wallet:open': {
    /**
     * The action of the wallet open event
     */
    wallet_action: string
  }
  /**
   * Triggered when a wallet is connected
   */
  'wallet:connect': {
    wallet_address: string
    chain_id: number
    wallet_connector: string
  }

  'wallet:disconnect': undefined

  // Search events
  'search:input': {
    ens_name: string
  }
  'search:select': {
    /**
     * The type of search
     */
    ens_name_type: 'eth' | 'box' | 'dns'
    /**
     * The name of the search
     */
    ens_name: string
  }

  // Register events
  'register:start': {
    ens_name: string
  }

  'register:dotbox': {
    ens_name: string
  }

  'register:back': {
    ens_name: string
    from_step: RegistrationStep
    to_step?: RegistrationStep
  }
  /**
   * After pricing is selected
   */
  'register:pricing': {
    ens_name: string
    /**
     * The duration of the registration
     */
    duration: number
    /**
     * The estimated total of the registration
     */
    estimated_total: bigint
    /**
     * Current price of ETH
     */
    eth_price: bigint
    /**
     * The payment method used
     */
    payment_method: PaymentMethod | ''
    /**
     * Whether a reverse record was added
     */
    add_reverse_record?: boolean
  }

  /**
   * Triggered when a moonpay payment starts and a external transaction is created
   */
  'register:moonpay_start': {
    ens_name: string
    external_transaction_id: string
    duration: number
  }

  /**
   * After a moonpay payment is completed
   */
  'register:moonpay_complete': {
    ens_name: string
    external_transaction_id: string
  }

  /**
   * When done with the profile page
   */
  'register:profile': {
    ens_name: string
    profile_records: ProfileRecord[]
    resolver_address?: string
  }

  /**
   * When done with the info page
   */
  'register:info': {
    ens_name: string
  }

  'register:transaction_claim': {
    ens_name: string
  }

  'register:transaction_claim_complete': {
    ens_name: string
  }

  'register:transaction_register': {
    ens_name: string
  }

  'register:transaction_reset': {
    ens_name: string
  }

  'register:transaction_override': {
    ens_name: string
  }

  'register:transaction_complete': {
    name: string
  }

  'register:complete': {
    name: string
  }

  // Import events
  'import:back': {
    name: string
    from: DnsStep
    to?: DnsStep
  }
  'import:select_type': {
    name: string
    type: DnsImportType
    next_step: DnsStep
  }

  'import:dnssec_enable': {
    name: string
  }

  'import:onchain_verify': {
    name: string
  }

  'import:transaction_start': {
    name: string
  }

  'import:transaction_complete': {
    name: string
  }

  'import:offchain_verify': {
    name: string
  }

  'import:complete': {
    name: string
  }
}

/**
 * Send a type safe event to PostHog
 * @param eventName - The name of the event to send
 * @param properties - The properties for the event
 */
export const sendEvent = <TEvent extends keyof EventDefs>(
  eventName: TEvent,
  ...args: EventDefs[TEvent] extends undefined ? [] : [EventDefs[TEvent]]
): void => {
  posthog.capture(eventName, args[0])
}
