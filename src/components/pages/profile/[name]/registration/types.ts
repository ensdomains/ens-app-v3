import { Address, Hex } from 'viem'

import { ProfileRecord } from '@app/constants/profileRecordOptions'
import { CurrentChildFuses } from '@app/types'

export type RegistrationStep = 'pricing' | 'profile' | 'info' | 'transactions' | 'complete'

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export enum PaymentMethod {
  ethereum = 'ethereum',
  moonpay = 'moonpay',
}

export type RegistrationStepData = {
  pricing: {
    seconds: number
    reverseRecord: boolean
    paymentMethodChoice: PaymentMethod | ''
    estimatedTotal?: bigint
    ethPrice?: bigint
    durationType: 'date' | 'years'
  }
  profile: {
    records: ProfileRecord[]
    clearRecords?: boolean
    resolverAddress?: Address
    permissions?: CurrentChildFuses
  }
  info: {}
  transactions: {
    secret: Hex
    started: boolean
  }
  complete: {}
}

export type BackObj = { back: boolean }

export type RegistrationData = Prettify<UnionToIntersection<RegistrationStepData[RegistrationStep]>>

export type SelectedItemProperties = {
  address: string
  name: string
  chainId: number
}

export type RegistrationReducerDataItem = Prettify<
  Omit<RegistrationData, 'paymentMethodChoice'> & {
    stepIndex: number
    queue: RegistrationStep[]
    isMoonpayFlow: boolean
    externalTransactionId: string
    version: number
  } & SelectedItemProperties
>

export type RegistrationReducerData = {
  items: RegistrationReducerDataItem[]
}

export type RegistrationReducerAction =
  | {
      name: 'increaseStep'
      selected: SelectedItemProperties
    }
  | {
      name: 'decreaseStep'
      selected: SelectedItemProperties
    }
  | {
      name: 'setQueue'
      selected: SelectedItemProperties
      payload: RegistrationStep[]
    }
  | {
      name: 'setPricingData'
      selected: SelectedItemProperties
      payload: Omit<RegistrationStepData['pricing'], 'paymentMethodChoice'>
    }
  | {
      name: 'setProfileData'
      selected: SelectedItemProperties
      payload: RegistrationStepData['profile']
    }
  | {
      name: 'setTransactionsData'
      selected: SelectedItemProperties
      payload: RegistrationStepData['transactions']
    }
  | {
      name: 'clearItem'
      selected: SelectedItemProperties
    }
  | {
      name: 'setStarted'
      selected: SelectedItemProperties
    }
  | {
      name: 'resetItem'
      selected: SelectedItemProperties
    }
  | {
      name: 'resetSecret'
      selected: SelectedItemProperties
    }
  | {
      name: 'setExternalTransactionId'
      selected: SelectedItemProperties
      externalTransactionId: string
    }
  | {
      name: 'moonpayTransactionCompleted'
      selected: SelectedItemProperties
    }

export type MoonpayTransactionStatus = 'pending' | 'completed' | 'failed' | 'waitingAuthorization'
