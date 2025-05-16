import posthog from 'posthog-js'
import { match, P } from 'ts-pattern'
import { useChainId } from 'wagmi'

import { randomSecret } from '@ensdomains/ensjs/utils'

import { childFuseObj } from '@app/components/@molecules/BurnFuses/BurnFusesContent'
import {
  RegistrationReducerAction,
  RegistrationReducerData,
  RegistrationReducerDataItem,
  SelectedItemProperties,
} from '@app/components/pages/profile/[name]/registration/types'
import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { sendEvent } from '@app/utils/analytics/events'
import { ONE_YEAR, yearsToSeconds } from '@app/utils/utils'

const REGISTRATION_REDUCER_DATA_ITEM_VERSION = 3

const defaultData: RegistrationReducerDataItem = {
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  seconds: yearsToSeconds(1),
  reverseRecord: false,
  records: [],
  clearRecords: false,
  resolverAddress: '0x',
  permissions: childFuseObj,
  secret: '0x',
  started: false,
  address: '0x',
  name: '',
  isMoonpayFlow: false,
  externalTransactionId: '',
  chainId: 1,
  durationType: 'years',
  version: REGISTRATION_REDUCER_DATA_ITEM_VERSION,
}

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const getDefaultRegistrationDuration = () => {
  const payload = posthog.getFeatureFlagPayload('default_registration_duration')

  return match(payload)
    .with({ years: P.number }, ({ years }) => years * ONE_YEAR)
    .otherwise(() => ONE_YEAR)
}

const makeDefaultData = (selected: SelectedItemProperties): RegistrationReducerDataItem => ({
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  seconds: getDefaultRegistrationDuration(),
  reverseRecord: false,
  records: [],
  resolverAddress: '0x',
  permissions: childFuseObj,
  secret: randomSecret({ platformDomain: 'enslabs.eth', campaign: 3 }),
  started: false,
  isMoonpayFlow: false,
  externalTransactionId: '',
  version: REGISTRATION_REDUCER_DATA_ITEM_VERSION,
  durationType: 'years',
  ...selected,
})

export const getSelectedIndex = (
  state: RegistrationReducerData,
  selected: SelectedItemProperties,
) =>
  state.items.findIndex(
    (x) =>
      x.address === selected.address &&
      x.name === selected.name &&
      x.chainId === selected.chainId &&
      x.version === REGISTRATION_REDUCER_DATA_ITEM_VERSION,
  )

/* eslint-disable no-param-reassign */
const reducer = (state: RegistrationReducerData, action: RegistrationReducerAction) => {
  let selectedItemInx = getSelectedIndex(state, action.selected)

  if (!isBrowser) return state

  if (selectedItemInx === -1) {
    selectedItemInx = state.items.push(makeDefaultData(action.selected)) - 1
  }

  const item = state.items[selectedItemInx]

  switch (action.name) {
    case 'clearItem': {
      state.items.splice(selectedItemInx, 1)
      break
    }
    case 'resetItem': {
      state.items[selectedItemInx] = makeDefaultData(action.selected)
      break
    }
    case 'resetSecret': {
      item.secret = randomSecret()
      break
    }
    case 'setQueue': {
      item.queue = action.payload
      break
    }
    case 'decreaseStep': {
      sendEvent('register:back', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: item.name,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        from_step: item.queue[item.stepIndex],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        to_step: item.queue[item.stepIndex - 1],
      })

      item.stepIndex -= 1
      break
    }
    case 'increaseStep': {
      if (item.queue[item.stepIndex + 1] === 'complete') {
        sendEvent('register:complete', {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ens_name: item.name,
        })
      }

      item.stepIndex += 1
      break
    }
    case 'setPricingData': {
      item.seconds = action.payload.seconds
      item.reverseRecord = action.payload.reverseRecord
      item.durationType = action.payload.durationType
      break
    }
    case 'setTransactionsData': {
      item.secret = action.payload.secret
      item.started = action.payload.started
      break
    }
    case 'setStarted': {
      item.started = true
      break
    }
    case 'setProfileData': {
      if (action.payload.records) item.records = action.payload.records
      if (action.payload.permissions) item.permissions = action.payload.permissions
      if (action.payload.resolverAddress) item.resolverAddress = action.payload.resolverAddress
      break
    }
    case 'setExternalTransactionId': {
      item.isMoonpayFlow = true
      item.externalTransactionId = action.externalTransactionId
      break
    }
    case 'moonpayTransactionCompleted': {
      item.externalTransactionId = ''
      item.stepIndex = item.queue.findIndex((step) => step === 'complete')

      sendEvent('register:complete', {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ens_name: item.name,
      })

      break
    }
    // no default
  }
  return state
}
/* eslint-enable no-param-reassign */

const useRegistrationReducer = ({
  address,
  name,
}: {
  address: string | undefined
  name: string
}) => {
  const chainId = useChainId()
  const selected = { address: address!, name, chainId } as const
  const [state, dispatch] = useLocalStorageReducer<
    RegistrationReducerData,
    RegistrationReducerAction
  >('registration-status', reducer, { items: [] })

  let item = defaultData
  if (isBrowser) {
    const itemIndex = getSelectedIndex(state, selected)
    item = itemIndex === -1 ? makeDefaultData(selected) : state.items[itemIndex]
  }

  return { state, dispatch, item, selected }
}

export default useRegistrationReducer
