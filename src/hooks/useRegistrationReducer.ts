import {
  RegistrationReducerAction,
  RegistrationReducerData,
  RegistrationReducerDataItem,
  SelectedItemProperties,
} from '@app/components/pages/profile/[name]/registration/types'
import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'

const randomSecret = () => {
  const bytes = Buffer.allocUnsafe(32)
  return `0x${window.crypto.getRandomValues(bytes).toString('hex')}`
}

const defaultData: RegistrationReducerDataItem = {
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  years: 1,
  reverseRecord: false,
  records: {},
  resolver: '',
  permissions: {},
  secret: '',
  started: false,
  address: '',
  name: '',
  isMoonpayFlow: false,
  externalTransactionId: '',
}

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const makeDefaultData = (selected: SelectedItemProperties): RegistrationReducerDataItem => ({
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  years: 1,
  reverseRecord: false,
  records: {},
  resolver: '',
  permissions: {},
  secret: randomSecret(),
  started: false,
  isMoonpayFlow: false,
  externalTransactionId: '',
  ...selected,
})

export const getSelectedIndex = (
  state: RegistrationReducerData,
  selected: SelectedItemProperties,
) => state.items.findIndex((x) => x.address === selected?.address && x.name === selected?.name)

/* eslint-disable no-param-reassign */
const reducer = (state: RegistrationReducerData, action: RegistrationReducerAction) => {
  let selectedItemInx = getSelectedIndex(state, action.selected)

  if (!isBrowser) return

  console.log('state: ', state.items)
  console.log('action: ', action)

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
      item.stepIndex -= 1
      break
    }
    case 'increaseStep': {
      console.log('*increaseStep*')
      item.stepIndex += 1
      break
    }
    case 'setExternalTransactionId': {
      console.log('*setExternalTransactionId*')
      item.isMoonpayFlow = true
      item.externalTransactionId = action.externalTransactionId
      break
    }
    case 'moonpayTransactionCompleted': {
      item.externalTransactionId = ''
      item.stepIndex += 2
      break
    }
    case 'setPricingData': {
      item.years = action.payload.years
      item.reverseRecord = action.payload.reverseRecord
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
    case 'setMoonpayFlow': {
      item.isMoonpayFlow = action.isMoonpayFlow
      item.externalTransactionId = action.externalTransactionId
      break
    }
    case 'setProfileData': {
      item.records = action.payload.records
      item.permissions = action.payload.permissions
      item.resolver = action.payload.resolver
      break
    }
    // no default
  }
}
/* eslint-enable no-param-reassign */

const useRegistrationReducer = ({
  address,
  name,
}: {
  address: string | undefined
  name: string
}) => {
  const selected = { address, name } as SelectedItemProperties
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
