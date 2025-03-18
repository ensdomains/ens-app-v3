/* eslint-disable @typescript-eslint/naming-convention */
import posthog from 'posthog-js'

import type {
  DnsImportType,
  DnsStep,
} from '@app/components/pages/import/[name]/useDnsImportReducer'
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

  // Commit Transactions
  'transaction:commit:send': {
    ens_name: string
    transaction_hash?: string
  }

  'transaction:commit:fail': {
    ens_name: string
    transaction_hash?: string
  }

  'transaction:commit:complete': {
    ens_name: string
    transaction_hash?: string
  }

  // Register Transactions
  'transaction:register:send': {
    ens_name: string
    transaction_hash?: string
  }

  'transaction:register:fail': {
    ens_name: string
    transaction_hash?: string
  }

  'transaction:register:complete': {
    ens_name: string
    transaction_hash?: string
  }

  'transaction:register:override': {
    ens_name: string
  }

  // Import transactions
  'transaction:import:send': {
    ens_name: string
    transaction_hash?: string
    type: 'claim' | 'import'
  }

  'transaction:import:fail': {
    ens_name: string
    transaction_hash?: string
    type: 'claim' | 'import'
  }

  'transaction:import:complete': {
    ens_name: string
    transaction_hash?: string
    type: 'claim' | 'import'
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

  'register:transaction_reset': {
    ens_name: string
  }

  'register:complete': {
    ens_name: string
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

  'import:offchain_verify': {
    name: string
  }

  'import:complete': {
    name: string
  }
}

function isProduction() {
  if (typeof window !== 'undefined') {
    return !!window.location.host.match('ens.domains')
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
  if (!isProduction()) {
    console.log('[Metrics] Event:', eventName, args[0])
  }

  posthog.capture(eventName, args[0])
}
