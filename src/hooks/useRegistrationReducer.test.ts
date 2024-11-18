import { renderHook } from '@testing-library/react'
import { useReducer } from 'react'
import { describe, expect, it, vi } from 'vitest'

import {
  RegistrationStep,
  RegistrationStepData,
} from '@app/components/pages/profile/[name]/registration/types'

import { makeDefaultData, reducer } from './useRegistrationReducer'

vi.mock('wagmi')

async function sleep() {
  return new Promise((res) => setTimeout(res))
}

const selected = {
  address: '0x8327FcD61f5e90e1E05A3F49DCbc9346b7d175f7',
  name: 'test.eth',
  chainId: 1,
  //   chainId: undefined as any,
}

describe('useRegistrationReducer', () => {
  it('should dispatch "clearItem" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    dispatch({
      name: 'clearItem',
      selected,
    })

    await sleep()

    expect(state.items).toHaveLength(0)
  })

  it('should dispatch "setQueue" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const queue: RegistrationStep[] = ['pricing']

    dispatch({
      name: 'setQueue',
      selected,
      payload: queue,
    })

    await sleep()

    expect(state.items[0].queue).toEqual(queue)
  })

  it('should dispatch "increaseStep" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    dispatch({
      name: 'increaseStep',
      selected,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'stepIndex'], 1)
  })

  it('should dispatch "decreaseStep" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    dispatch({
      name: 'decreaseStep',
      selected,
    })

    await sleep()

    console.dir(state, { depth: null })

    expect(state).toHaveProperty(['items', 0, 'stepIndex'], -1)
  })

  it('should dispatch "setPricingData" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const payload: Omit<RegistrationStepData['pricing'], 'paymentMethodChoice'> = {
      seconds: 120,
      reverseRecord: false,
      durationType: 'date',
    }

    dispatch({
      name: 'setPricingData',
      selected,
      payload,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'seconds'], payload.seconds)
    expect(state).toHaveProperty(['items', 0, 'reverseRecord'], payload.reverseRecord)
    expect(state).toHaveProperty(['items', 0, 'durationType'], payload.durationType)
  })

  it('should dispatch "setPricingData" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const payload: Omit<RegistrationStepData['pricing'], 'paymentMethodChoice'> = {
      seconds: 120,
      reverseRecord: false,
      durationType: 'date',
    }

    dispatch({
      name: 'setPricingData',
      selected,
      payload,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'seconds'], payload.seconds)
    expect(state).toHaveProperty(['items', 0, 'reverseRecord'], payload.reverseRecord)
    expect(state).toHaveProperty(['items', 0, 'durationType'], payload.durationType)
  })

  it('should dispatch "setTransactionsData" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const payload: RegistrationStepData['transactions'] = {
      secret: '0x1',
      started: false,
    }

    dispatch({
      name: 'setTransactionsData',
      selected,
      payload,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'secret'], payload.secret)
    expect(state).toHaveProperty(['items', 0, 'started'], payload.started)
  })

  it('should dispatch "setStarted" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    dispatch({
      name: 'setStarted',
      selected,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'started'], true)
  })

  it('should dispatch "setProfileData" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const payload: RegistrationStepData['profile'] = {
      records: [{ key: '', value: '', type: 'text', group: 'general' }],
      resolverAddress: '0x1',
      permissions: {
        CANNOT_APPROVE: false,
        CANNOT_BURN_FUSES: false,
        CANNOT_CREATE_SUBDOMAIN: false,
        CANNOT_SET_RESOLVER: false,
        CANNOT_SET_TTL: false,
        CANNOT_TRANSFER: false,
        CANNOT_UNWRAP: true,
      },
    }

    dispatch({
      name: 'setProfileData',
      selected,
      payload,
    })

    await sleep()

    expect(state.items[0].records).toEqual(payload.records)
    expect(state.items[0].permissions).toEqual(payload.permissions)
    expect(state).toHaveProperty(['items', 0, 'resolverAddress'], payload.resolverAddress)
  })

  it('should dispatch "setExternalTransactionId" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const payload = {
      externalTransactionId: 'test',
    }

    dispatch({
      name: 'setExternalTransactionId',
      selected,
      ...payload,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'isMoonpayFlow'], true)
    expect(state).toHaveProperty(
      ['items', 0, 'externalTransactionId'],
      payload.externalTransactionId,
    )
  })

  it('should dispatch "moonpayTransactionCompleted" properly', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    dispatch({
      name: 'moonpayTransactionCompleted',
      selected,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'externalTransactionId'], '')
    expect(state).toHaveProperty(['items', 0, 'stepIndex'], state.items[0].queue.length - 1)
  })

  /////////////////////////////////////////////////////////////////////////////////

  it('should break "moonpayTransactionCompleted" if have invalid queue sequence', async () => {
    const draft = {
      items: [makeDefaultData(selected)],
    }

    const { result } = renderHook(() => useReducer(reducer, draft))

    const [state, dispatch] = result.current

    const queue: RegistrationStep[] = ['complete', 'info']

    dispatch({
      name: 'setQueue',
      selected,
      payload: queue,
    })

    dispatch({
      name: 'moonpayTransactionCompleted',
      selected,
    })

    await sleep()

    expect(state).toHaveProperty(['items', 0, 'externalTransactionId'], '')
    expect(state).toHaveProperty(
      ['items', 0, 'stepIndex'],
      queue.findIndex((i) => i === 'complete'),
    )
  })
})
