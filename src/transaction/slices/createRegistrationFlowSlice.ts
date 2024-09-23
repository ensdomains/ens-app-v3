import { zeroAddress, type Address, type Hex } from 'viem'
import type { StateCreator } from 'zustand'

import { randomSecret } from '@ensdomains/ensjs/utils'

import { childFuseObj } from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import type { InitiateMoonpayRegistrationMutationResult } from '@app/components/pages/register/useMoonpayRegistration'
import { mainnetWithEns, type SourceChain } from '@app/constants/chains'
import type { ProfileRecord } from '@app/constants/profileRecordOptions'
import { getRegistrationParams } from '@app/hooks/useRegistrationParams'
import type { CurrentChildFuses } from '@app/types'
import { getSupportedChainContractAddress } from '@app/utils/getSupportedChainContractAddress'
import { wagmiConfig } from '@app/utils/query/wagmi'
import { secondsToYears, yearsToSeconds } from '@app/utils/time'

import { getFlowKey } from '../key'
import type { TransactionStoreIdentifiers } from '../types'
import type { StoredTransaction } from './createTransactionSlice'
import type { AllSlices, MiddlewareArray } from './types'
import { getIdentifiers } from './utils'

export type RegistrationFlowStep = 'pricing' | 'profile' | 'info' | 'transactions' | 'complete'
export type RegistrationPaymentMethod = 'ethereum' | 'moonpay'
export type RegistrationDurationType = 'date' | 'years'

type RegistrationName = string
type RegistrationFlowKey = `["${RegistrationName}",${SourceChain['id']},"${Address}"]`

type RegistrationPricingStepData = {
  seconds: number
  reverseRecord: boolean
  paymentMethodChoice: RegistrationPaymentMethod
  durationType: RegistrationDurationType
}

type RegistrationProfileStepData = {
  records: ProfileRecord[]
  resolverAddress: Address | null
  clearRecords?: boolean
  permissions?: CurrentChildFuses
}

type RegistrationTransactionsStepData = {
  secret: Hex
  isStarted: boolean
}

type RegistrationFlowData = RegistrationPricingStepData &
  RegistrationProfileStepData &
  RegistrationTransactionsStepData

type RegistrationFlowIdentifiers = TransactionStoreIdentifiers & {
  name: RegistrationName
}

type MoonpayExternalTransactionData = {
  type: 'moonpay'
  id: string
  url: string
}

export type StoredRegistrationFlow = RegistrationFlowIdentifiers &
  Required<RegistrationFlowData> & {
    stepIndex: number
    queue: RegistrationFlowStep[]
    externalTransactionData: MoonpayExternalTransactionData | null
  }

export type RegistrationFlowSlice = {
  registrationFlows: Map<RegistrationFlowKey, StoredRegistrationFlow>

  getCurrentRegistrationFlowOrDefault: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => StoredRegistrationFlow
  getCurrentRegistrationFlowStep: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => RegistrationFlowStep
  getCurrentCommitTransaction: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => StoredTransaction | null
  getCurrentRegisterTransaction: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => StoredTransaction | null

  increaseRegistrationFlowStep: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  decreaseRegistrationFlowStep: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  setRegistrationFlowQueue: (
    name: RegistrationName,
    queue: RegistrationFlowStep[],
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  setRegistrationPricingData: (
    name: RegistrationName,
    pricingData: RegistrationPricingStepData,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  setRegistrationProfileData: (
    name: RegistrationName,
    profileData: Partial<RegistrationProfileStepData>,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  setRegistrationTransactionsData: (
    name: RegistrationName,
    transactionsData: RegistrationTransactionsStepData,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  clearRegistrationFlow: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  setRegistrationFlowStarted: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  resetRegistrationFlow: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  resetRegistrationSecret: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  setRegistrationExternalTransactionData: (
    name: RegistrationName,
    externalTransactionData: MoonpayExternalTransactionData,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  onRegistrationMoonpayTransactionCompleted: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  traverseRegistrationFlow: (
    name: RegistrationName,
    data: { back: boolean },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  createRegistrationFlow: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void

  onRegistrationPricingStepCompleted: (
    name: RegistrationName,
    data: RegistrationPricingStepData & {
      resolverExists: boolean
      initiateMoonpayRegistrationMutation: InitiateMoonpayRegistrationMutationResult
    },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  onRegistrationProfileStepCompleted: (
    name: RegistrationName,
    data: RegistrationProfileStepData & { back: boolean },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  onRegistrationInfoStepCompleted: (
    name: RegistrationName,
    data: { back: boolean },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  onRegistrationTransactionsStepCompleted: (
    name: RegistrationName,
    data: { back: boolean; resetSecret?: boolean },
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void

  startCommitNameTransaction: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  startRegisterNameTransaction: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  resumeCommitNameTransaction: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  resumeRegisterNameTransaction: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
  resetRegistrationTransactions: (
    name: RegistrationName,
    identifiersOverride?: TransactionStoreIdentifiers,
  ) => void
}

const getIdentifiersWithDefault = (
  state: AllSlices,
  identifiersOverride?: TransactionStoreIdentifiers,
) => {
  const { account, sourceChainId } = identifiersOverride ?? state.current
  return { account: account ?? zeroAddress, sourceChainId: sourceChainId ?? mainnetWithEns.id }
}

const getCurrentRegistrationFlow = (
  name: RegistrationName,
  state: AllSlices,
  identifiersOverride?: TransactionStoreIdentifiers,
) => {
  const { account, sourceChainId } = getIdentifiers(state, identifiersOverride)

  const registrationFlowKey = getFlowKey({ flowId: name, sourceChainId, account })
  const registrationFlow = state.registrationFlows.get(registrationFlowKey)
  if (!registrationFlow) throw new Error('No registration flow found')
  return registrationFlow
}

const createDefaultRegistrationFlowData = (
  identifiers: RegistrationFlowIdentifiers,
): StoredRegistrationFlow => ({
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  seconds: yearsToSeconds(1),
  reverseRecord: false,
  records: [],
  resolverAddress: '0x',
  permissions: childFuseObj,
  secret: randomSecret({ platformDomain: 'enslabs.eth', campaign: 3 }),
  isStarted: false,
  paymentMethodChoice: 'ethereum',
  externalTransactionData: null,
  durationType: 'years',
  clearRecords: false,
  ...identifiers,
})

const getCommitTransactionFlowId = (name: RegistrationName) => `commit-${name}`
const getRegisterTransactionFlowId = (name: RegistrationName) => `register-${name}`

export const createRegistrationFlowSlice: StateCreator<
  AllSlices,
  MiddlewareArray,
  [],
  RegistrationFlowSlice
> = (set, get) => ({
  registrationFlows: new Map(),
  getCurrentRegistrationFlowOrDefault: (name, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiersWithDefault(state, identifiersOverride)
    const registrationFlowKey = getFlowKey({ flowId: name, ...identifiers })
    return (
      state.registrationFlows.get(registrationFlowKey) ??
      createDefaultRegistrationFlowData({ name, ...identifiers })
    )
  },
  getCurrentRegistrationFlowStep: (name, identifiersOverride) => {
    const state = get()
    const currentRegistrationFlow = state.getCurrentRegistrationFlowOrDefault(
      name,
      identifiersOverride,
    )
    console.log('step:', currentRegistrationFlow.queue[currentRegistrationFlow.stepIndex])
    return currentRegistrationFlow.queue[currentRegistrationFlow.stepIndex]
  },
  getCurrentCommitTransaction: (name, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    const flowId = getCommitTransactionFlowId(name)
    const transactions = state.getFlowTransactionsOrNull(flowId, identifiers)
    return transactions?.[0] ?? null
  },
  getCurrentRegisterTransaction: (name, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    const flowId = getRegisterTransactionFlowId(name)
    const transactions = state.getFlowTransactionsOrNull(flowId, identifiers)
    return transactions?.[0] ?? null
  },
  increaseRegistrationFlowStep: (name, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.stepIndex += 1
    }),
  decreaseRegistrationFlowStep: (name, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.stepIndex -= 1
    }),
  setRegistrationFlowQueue: (name, queue, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.queue = queue
    }),
  setRegistrationPricingData: (name, pricingData, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.seconds = pricingData.seconds
      registrationFlow.reverseRecord = pricingData.reverseRecord
      registrationFlow.paymentMethodChoice = pricingData.paymentMethodChoice
      registrationFlow.durationType = pricingData.durationType
    }),
  setRegistrationProfileData: (name, profileData, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      if (profileData.records) registrationFlow.records = profileData.records
      if (profileData.permissions) registrationFlow.permissions = profileData.permissions
      if (profileData.resolverAddress)
        registrationFlow.resolverAddress = profileData.resolverAddress
    }),
  setRegistrationTransactionsData: (name, transactionsData, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.secret = transactionsData.secret
      registrationFlow.isStarted = transactionsData.isStarted
    }),
  clearRegistrationFlow: (name, identifiersOverride) =>
    set((state) => {
      const identifiers = getIdentifiersWithDefault(state, identifiersOverride)
      const registrationFlowKey = getFlowKey({ flowId: name, ...identifiers })
      state.registrationFlows.delete(registrationFlowKey)
      state.cleanupFlowUnsafe(getCommitTransactionFlowId(name), identifiers)
      state.cleanupFlowUnsafe(getRegisterTransactionFlowId(name), identifiers)
    }),
  setRegistrationFlowStarted: (name, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.isStarted = true
    }),
  resetRegistrationFlow: (name, identifiersOverride) =>
    set((state) => {
      const identifiers = getIdentifiersWithDefault(state, identifiersOverride)
      const registrationFlowKey = getFlowKey({ flowId: name, ...identifiers })
      state.registrationFlows.set(
        registrationFlowKey,
        createDefaultRegistrationFlowData({ name, ...identifiers }),
      )
    }),
  resetRegistrationSecret: (name, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.secret = randomSecret({ platformDomain: 'enslabs.eth', campaign: 3 })
    }),
  setRegistrationExternalTransactionData: (name, externalTransactionData, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.externalTransactionData = externalTransactionData
    }),
  onRegistrationMoonpayTransactionCompleted: (name, identifiersOverride) =>
    set((state) => {
      const registrationFlow = getCurrentRegistrationFlow(name, state, identifiersOverride)
      registrationFlow.externalTransactionData = null
      registrationFlow.stepIndex = registrationFlow.queue.findIndex((step) => step === 'complete')
    }),
  traverseRegistrationFlow: (name, data, identifiersOverride) => {
    const state = get()
    if (data.back) state.decreaseRegistrationFlowStep(name, identifiersOverride)
    else state.increaseRegistrationFlowStep(name, identifiersOverride)
  },
  createRegistrationFlow: (name, identifiersOverride) =>
    set((state) => {
      const identifiers = getIdentifiers(state, identifiersOverride)
      const registrationFlowKey = getFlowKey({ flowId: name, ...identifiers })
      state.registrationFlows.set(
        registrationFlowKey,
        createDefaultRegistrationFlowData({ name, ...identifiers }),
      )
    }),
  onRegistrationPricingStepCompleted: (name, data, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    if (data.paymentMethodChoice === 'moonpay') {
      data.initiateMoonpayRegistrationMutation.mutate({
        address: identifiers.account,
        chainId: identifiers.sourceChainId,
        duration: secondsToYears(data.seconds),
        name,
      })
      return
    }
    state.createRegistrationFlow(name, identifiers)
    state.setRegistrationPricingData(name, data, identifiers)
    let currentRegistrationFlow = state.getCurrentRegistrationFlowOrDefault(name, identifiers)
    if (!currentRegistrationFlow.queue.includes('profile')) {
      // if profile is not in queue, set the default profile data
      const defaultResolverAddress = getSupportedChainContractAddress({
        client: wagmiConfig.getClient({ chainId: identifiers.sourceChainId }),
        contract: 'ensPublicResolver',
      })

      state.setRegistrationProfileData(name, {
        records: [{ key: 'eth', group: 'address', type: 'addr', value: identifiers.account }],
        clearRecords: data.resolverExists,
        resolverAddress: defaultResolverAddress,
      })

      if (data.reverseRecord) {
        // if reverse record is selected, add the profile step to the queue
        state.setRegistrationFlowQueue(
          name,
          ['pricing', 'profile', 'info', 'transactions', 'complete'],
          identifiers,
        )
      }
    }

    currentRegistrationFlow = state.getCurrentRegistrationFlowOrDefault(name, identifiers)
    // if profile is in queue and reverse record is selected, make sure that eth record is included and is set to address
    if (currentRegistrationFlow.queue.includes('profile') && data.reverseRecord) {
      const recordsWithoutEth = currentRegistrationFlow.records.filter(
        (record) => record.key !== 'eth',
      )
      const newRecords: ProfileRecord[] = [
        { key: 'eth', group: 'address', type: 'addr', value: identifiers.account },
        ...recordsWithoutEth,
      ]
      state.setRegistrationProfileData(name, { records: newRecords }, identifiers)
    }

    state.increaseRegistrationFlowStep(name, identifiers)
  },
  onRegistrationProfileStepCompleted: (name, data, identifiersOverride) => {
    const state = get()
    state.setRegistrationProfileData(
      name,
      { records: data.records, resolverAddress: data.resolverAddress },
      identifiersOverride,
    )
    state.traverseRegistrationFlow(name, data, identifiersOverride)
  },
  onRegistrationInfoStepCompleted: (name, data, identifiersOverride) => {
    const state = get()
    state.traverseRegistrationFlow(name, data, identifiersOverride)
  },
  onRegistrationTransactionsStepCompleted: (name, data, identifiersOverride) => {
    const state = get()
    if (data.resetSecret) state.resetRegistrationSecret(name, identifiersOverride)
    state.traverseRegistrationFlow(name, data, identifiersOverride)
  },
  startCommitNameTransaction: (name, identifiersOverride) => {
    const state = get()
    state.setRegistrationFlowStarted(name, identifiersOverride)

    const identifiers = getIdentifiers(state, identifiersOverride)
    const currentRegistrationFlow = state.getCurrentRegistrationFlowOrDefault(
      name,
      identifiersOverride,
    )
    const registrationParams = getRegistrationParams({
      name,
      owner: identifiers.account,
      registrationData: currentRegistrationFlow,
    })

    const flowId = getCommitTransactionFlowId(name)
    state.startFlow({
      flowId,
      transactions: [
        {
          name: 'commitName',
          data: registrationParams,
        },
      ],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${name}`,
    })
  },
  startRegisterNameTransaction: (name, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    const currentRegistrationFlow = state.getCurrentRegistrationFlowOrDefault(name, identifiers)
    const registrationParams = getRegistrationParams({
      name,
      owner: identifiers.account,
      registrationData: currentRegistrationFlow,
    })

    const flowId = getRegisterTransactionFlowId(name)
    state.startFlow({
      flowId,
      transactions: [
        {
          name: 'registerName',
          data: registrationParams,
        },
      ],
      requiresManualCleanup: true,
      autoClose: true,
      resumeLink: `/register/${name}`,
    })
  },
  resumeCommitNameTransaction: (name, identifiersOverride) => {
    const state = get()
    state.resumeFlow(getCommitTransactionFlowId(name), identifiersOverride)
  },
  resumeRegisterNameTransaction: (name, identifiersOverride) => {
    const state = get()
    state.resumeFlow(getRegisterTransactionFlowId(name), identifiersOverride)
  },
  resetRegistrationTransactions: (name, identifiersOverride) => {
    const state = get()
    const identifiers = getIdentifiers(state, identifiersOverride)
    state.cleanupFlowUnsafe(getCommitTransactionFlowId(name), identifiers)
    state.cleanupFlowUnsafe(getRegisterTransactionFlowId(name), identifiers)
    state.resetRegistrationSecret(name, identifiers)
    state.traverseRegistrationFlow(name, { back: true }, identifiers)
  },
})
