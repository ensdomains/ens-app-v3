import { Address } from 'viem'

import { useChainId } from '@app/hooks/chain/useChainId'
import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { isBrowser } from '@app/utils/utils'

export type DnsImportType = 'onchain' | 'offchain' | null

export type SelectedItemProperties =
  | { address: Address; name: string; chainId: number }
  | { address: Address | null; name: string; chainId: 1 }

export type DnsImportReducerDataItem = {
  stepIndex: number
  name: string
  type: DnsImportType
  address: Address | null
  started: boolean
  chainId: number
}

export type DnsImportReducerData = {
  items: DnsImportReducerDataItem[]
}

export type DnsImportReducerAction =
  | {
      name: 'increaseStep'
      selected: SelectedItemProperties
    }
  | {
      name: 'decreaseStep'
      selected: SelectedItemProperties
    }
  | {
      name: 'setType'
      selected: SelectedItemProperties
      payload: DnsImportType
    }
  | {
      name: 'setStarted'
      selected: SelectedItemProperties
    }
  | {
      name: 'setAddress'
      selected: SelectedItemProperties
      payload: Address
    }
  | {
      name: 'clearItem'
      selected: SelectedItemProperties
    }
  | {
      name: 'resetItem'
      selected: SelectedItemProperties
    }

const defaultData = Object.freeze({
  stepIndex: 0,
  name: '',
  type: null,
  address: '0x',
  started: false,
  chainId: 1,
}) as DnsImportReducerDataItem

const createDefaultData = (selected: SelectedItemProperties): DnsImportReducerDataItem => ({
  ...defaultData,
  ...selected,
})

export const getSelectedIndex = (state: DnsImportReducerData, selected: SelectedItemProperties) =>
  state.items.findIndex(
    (x) =>
      (x.address === selected.address || x.address === null) &&
      x.name === selected.name &&
      x.chainId === selected.chainId,
  )

/* eslint-disable no-param-reassign */
const reducer = (state: DnsImportReducerData, action: DnsImportReducerAction) => {
  let selectedItemInx = getSelectedIndex(state, action.selected)

  if (!isBrowser) return

  if (selectedItemInx === -1) {
    selectedItemInx = state.items.push(createDefaultData(action.selected)) - 1
  }

  const selectedItem = state.items[selectedItemInx]

  switch (action.name) {
    case 'increaseStep':
      selectedItem.stepIndex += 1
      break
    case 'decreaseStep':
      selectedItem.stepIndex -= 1
      break
    case 'setType':
      selectedItem.type = action.payload
      break
    case 'setStarted':
      selectedItem.started = true
      break
    case 'setAddress':
      selectedItem.address = action.payload
      break
    case 'resetItem':
      state.items[selectedItemInx] = createDefaultData(action.selected)
      break
    case 'clearItem':
      state.items.splice(selectedItemInx, 1)
      break
    default:
      break
  }

  return state
}
/* eslint-enable no-param-reassign */

export const useDnsImportReducer = ({
  address,
  name,
}: {
  address: Address | undefined
  name: string
}) => {
  const chainId = useChainId()
  const selected = { address: address || null, name, chainId } as SelectedItemProperties
  const [state, dispatch] = useLocalStorageReducer<DnsImportReducerData, DnsImportReducerAction>(
    'dns-import',
    reducer,
    { items: [] },
  )

  let item = defaultData
  if (isBrowser) {
    console.log('running')
    const itemIndex = getSelectedIndex(state, selected)
    item = itemIndex === -1 ? createDefaultData(selected) : state.items[itemIndex]
  }

  return { state, dispatch, item, selected }
}
