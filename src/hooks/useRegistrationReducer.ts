import posthog from 'posthog-js'
import { match, P } from 'ts-pattern'
import { useChainId } from 'wagmi'

import { EMPTY_ADDRESS, EMPTY_BYTES32, randomSecret } from '@ensdomains/ensjs/utils'

import {
  RegistrationReducerAction,
  RegistrationReducerData,
  RegistrationReducerDataItem,
  SelectedItemProperties,
} from '@app/components/pages/profile/[name]/registration/types'
import { useLocalStorageReducer } from '@app/hooks/useLocalStorage'
import { useReferrer } from '@app/hooks/useReferrer'
import { sendEvent } from '@app/utils/analytics/events'
import { ONE_YEAR, yearsToSeconds } from '@app/utils/utils'

const REGISTRATION_REDUCER_DATA_ITEM_VERSION = 4

const defaultData: RegistrationReducerDataItem = {
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  seconds: yearsToSeconds(1),
  reverseRecord: false,
  records: [],
  clearRecords: false,
  resolverAddress: EMPTY_ADDRESS,
  secret: EMPTY_BYTES32,
  started: false,
  address: EMPTY_ADDRESS,
  name: '',
  isMoonpayFlow: false,
  externalTransactionId: '',
  chainId: 1,
  durationType: 'years',
  version: REGISTRATION_REDUCER_DATA_ITEM_VERSION,
  referrer: EMPTY_BYTES32,
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

/**
 * Validates and pads a referrer hex string to 32 bytes.
 * The referrer should already be a hex string from the query parameter.
 * Returns EMPTY_BYTES32 if the referrer is undefined or invalid.
 */
const getReferrerHex = (referrer: string | undefined): `0x${string}` => {
  if (!referrer) return EMPTY_BYTES32

  // Check if it's a valid hex string (starts with 0x and contains only hex chars)
  if (!/^0x[0-9a-fA-F]*$/.test(referrer)) {
    return EMPTY_BYTES32
  }

  // Remove '0x' prefix, pad to 64 hex chars (32 bytes), and add '0x' back
  const hexWithoutPrefix = referrer.slice(2)
  const paddedHex = hexWithoutPrefix.padEnd(64, '0')

  // Ensure it's exactly 64 chars (32 bytes)
  if (paddedHex.length > 64) {
    return EMPTY_BYTES32
  }

  return `0x${paddedHex}` as `0x${string}`
}

const makeDefaultData = (selected: SelectedItemProperties): RegistrationReducerDataItem => ({
  stepIndex: 0,
  queue: ['pricing', 'info', 'transactions', 'complete'],
  seconds: getDefaultRegistrationDuration(),
  reverseRecord: false,
  records: [],
  resolverAddress: EMPTY_ADDRESS,
  secret: randomSecret({ platformDomain: 'enslabs.eth', campaign: 3 }),
  started: false,
  isMoonpayFlow: false,
  externalTransactionId: '',
  version: REGISTRATION_REDUCER_DATA_ITEM_VERSION,
  durationType: 'years',
  referrer: selected.referrer || EMPTY_BYTES32,
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
      x.version === REGISTRATION_REDUCER_DATA_ITEM_VERSION &&
      x.referrer === (selected.referrer || EMPTY_BYTES32),
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
    case 'setReferrer': {
      item.referrer = action.payload
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
  const referrer = useReferrer()
  const referrerHex = getReferrerHex(referrer)
  const selected = { address: address!, name, chainId, referrer: referrerHex } as const
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
