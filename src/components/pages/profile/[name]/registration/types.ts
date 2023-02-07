import { ChildFuses } from '@ensdomains/ensjs'

import { ProfileRecord } from '@app/constants/profileRecordOptions'

export type RegistrationStep = 'pricing' | 'profile' | 'info' | 'transactions' | 'complete'

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

export type RegistrationStepData = {
  pricing: {
    years: number
    reverseRecord: boolean
  }
  profile: {
    records: ProfileRecord[]
    clearRecords?: boolean
    resolver?: string
    permissions?: ChildFuses['current']
  }
  info: {}
  transactions: {
    secret: string
    started: boolean
  }
  complete: {}
}

export type BackObj = { back: boolean }

export type RegistrationData = UnionToIntersection<RegistrationStepData[RegistrationStep]>

export type SelectedItemProperties = { address: string; name: string }

export type RegistrationReducerDataItem = RegistrationData & {
  stepIndex: number
  queue: RegistrationStep[]
  isMoonpayFlow: boolean
  externalTransactionId: string
} & SelectedItemProperties

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
      payload: RegistrationStepData['pricing']
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
