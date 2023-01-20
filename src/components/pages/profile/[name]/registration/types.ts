import type { ChildFuses } from '@ensdomains/ensjs'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

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
    records: RecordOptions
    resolver: string
    permissions: ChildFuses['current']
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
