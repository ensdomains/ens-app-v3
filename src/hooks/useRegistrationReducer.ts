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
  step: 'pricing',
  years: 1,
  reverseRecord: false,
  records: {},
  resolver: '',
  permissions: {},
  secret: '',
  started: false,
  address: '',
  name: '',
}

const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

const makeDefaultData = (selected: SelectedItemProperties): RegistrationReducerDataItem => ({
  step: 'pricing',
  years: 1,
  reverseRecord: false,
  records: {},
  resolver: '',
  permissions: {},
  secret: randomSecret(),
  started: false,
  ...selected,
})

export const getSelectedIndex = (
  state: RegistrationReducerData,
  selected: SelectedItemProperties,
) => state.items.findIndex((x) => x.address === selected.address && x.name === selected.name)

/* eslint-disable no-param-reassign */
const reducer = (state: RegistrationReducerData, action: RegistrationReducerAction) => {
  let selectedItemInx = getSelectedIndex(state, action.selected)

  if (!isBrowser) return

  if (selectedItemInx === -1) {
    selectedItemInx = state.items.push(makeDefaultData(action.selected)) - 1
  }

  switch (action.name) {
    case 'setStep': {
      state.items[selectedItemInx].step = action.payload
      break
    }
    case 'clearItem': {
      state.items.splice(selectedItemInx, 1)
      break
    }
    case 'setPricingData':
    case 'setTransactionsData':
    case 'setProfileData':
      state.items[selectedItemInx] = { ...state.items[selectedItemInx], ...action.payload }
      break
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
