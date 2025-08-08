import { useEffect } from 'react'
import { Address } from 'viem'
import { useChainId } from 'wagmi'

import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { sendEvent } from '@app/utils/analytics/events'
import { isBrowser } from '@app/utils/utils'

export const dnsConfigurationSteps = Object.freeze(['selectType', 'enableDnssec'] as const)

export const dnsTypeStepMap = Object.freeze({
  onchain: ['verifyOnchainOwnership', 'transaction', 'completeOnchain'],
  offchain: ['verifyOffchainOwnership', 'completeOffchain'],
} as const)

export type DnsStep =
  | (typeof dnsConfigurationSteps)[number]
  | (typeof dnsTypeStepMap)['onchain'][number]
  | (typeof dnsTypeStepMap)['offchain'][number]

export type DnsImportType = 'onchain' | 'offchain' | null

export type SelectedItemProperties =
  | { address: Address; name: string; chainId: number }
  | { address: Address | null; name: string; chainId: 1 }

export type DnsImportReducerDataItem = {
  stepIndex: number
  steps: readonly DnsStep[] | DnsStep[]
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
      name: 'setSteps'
      selected: SelectedItemProperties
      payload: readonly DnsStep[] | DnsStep[]
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
  | {
      name: 'cleanupNonMatching'
      selected: SelectedItemProperties
    }

const defaultData = Object.freeze({
  stepIndex: 0,
  steps: dnsConfigurationSteps,
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

export const getSelectedIndex = (state: DnsImportReducerData, selected: SelectedItemProperties) => {
  const noAddressIndex = state.items.findIndex(
    (x) => x.address === null && x.name === selected.name && x.chainId === selected.chainId,
  )
  if (noAddressIndex !== -1) return noAddressIndex
  return state.items.findIndex(
    (x) =>
      x.address === selected.address && x.name === selected.name && x.chainId === selected.chainId,
  )
}

/* eslint-disable no-param-reassign */
const reducer = () => (state: DnsImportReducerData, action: DnsImportReducerAction) => {
  let selectedItemInx = getSelectedIndex(state, action.selected)

  if (!isBrowser) return

  if (selectedItemInx === -1) {
    selectedItemInx = state.items.push(createDefaultData(action.selected)) - 1
  }

  const selectedItem = state.items[selectedItemInx]

  switch (action.name) {
    case 'increaseStep': {
      selectedItem.stepIndex += 1
      return state
    }
    case 'decreaseStep':
      sendEvent('import:back', {
        name: selectedItem.name,
        from: selectedItem.steps[selectedItem.stepIndex],
        to: selectedItem.steps[selectedItem.stepIndex - 1],
      })

      selectedItem.stepIndex -= 1
      break
    case 'setSteps':
      selectedItem.steps = action.payload
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
    case 'cleanupNonMatching':
      for (let i = 0; i < state.items.length; i += 1) {
        const item = state.items[i]
        if (item !== selectedItem && state.items[i].started === false) {
          state.items.splice(i, 1)
          i -= 1
        }
      }
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
    reducer(),
    { items: [] },
  )

  let item = defaultData
  if (isBrowser) {
    const itemIndex = getSelectedIndex(state, selected)
    item = itemIndex === -1 ? createDefaultData(selected) : state.items[itemIndex]
  }

  useEffect(() => {
    dispatch({ name: 'cleanupNonMatching', selected })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, name, chainId])

  return { state, dispatch, item, selected }
}
