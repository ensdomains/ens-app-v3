export type RegistrationStep = 'pricing' | 'profile' | 'info' | 'transactions'

export type RegistrationStepData = {
  pricing: {
    years: number
    makePrimary: boolean
  }
  profile: {
    records: object
    resolver: string
    permissions: object
  }
}

export type RegistrationData = RegistrationStepData['pricing'] & RegistrationStepData['profile']
