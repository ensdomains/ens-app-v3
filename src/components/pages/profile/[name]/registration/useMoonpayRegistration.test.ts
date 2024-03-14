import { renderHook, waitFor } from '@app/test-utils'

import { labelhash } from 'viem'
import { describe, expect, it, vi } from 'vitest'

import { MOONPAY_WORKER_URL } from '@app/utils/constants'

import { useMoonpayRegistration } from './useMoonpayRegistration'

vi.mock('@app/hooks/account/useAccountSafely', () => ({
  useAccountSafely: () => ({ address: '0x123' }),
}))

describe('useMoonpayRegistration', () => {
  it('should check up on transaction status every second if a there is a currentExternalTransactionId', async () => {
    const mockDispatch = vi.fn()
    const normalisedName = 'test.eth'
    const selected = {} as any
    const item = {
      externalTransactionId: '0x123',
    } as any
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ message: 'uploaded' }],
      })
    })

    renderHook(() => useMoonpayRegistration(mockDispatch, normalisedName, selected, item))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2), { timeout: 2000 })
  })
  it('should stop refetching once transaction is complete', async () => {
    const mockDispatch = vi.fn()
    const normalisedName = 'test.eth'
    const selected = {} as any
    let item = {
      externalTransactionId: '0x123',
    } as any
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ status: 'pending' }],
      })
    })

    const { rerender, result } = renderHook(() =>
      useMoonpayRegistration(mockDispatch, normalisedName, selected, item),
    )
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2), { timeout: 2000 })

    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ status: 'completed' }],
      })
    })
    rerender()
    await waitFor(
      () =>
        expect(mockDispatch).toHaveBeenCalledWith({
          name: 'moonpayTransactionCompleted',
          selected,
        }),
      { timeout: 2000 },
    )

    item = { externalTransactionId: undefined }
    rerender()

    expect(result.current.moonpayTransactionStatus).toBe(undefined)
  })
  it('should stop refetching if name changes and new name does not have a currentExternalTransactionId', async () => {
    const mockDispatch = vi.fn()
    let normalisedName = 'test.eth'
    const selected = {} as any
    let item = {
      externalTransactionId: '0x123',
    } as any
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ status: 'pending' }],
      })
    })

    const { rerender, result } = renderHook(() =>
      useMoonpayRegistration(mockDispatch, normalisedName, selected, item),
    )
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2), { timeout: 2000 })

    normalisedName = 'test2.eth'
    item = {
      externalTransactionId: undefined,
    }
    rerender()
    expect(result.current.moonpayTransactionStatus).toBe(undefined)
  })
  it('should have the correct regsitration duration when initiating a registration', async () => {
    const registrationDuration = 5
    const chainId = 1
    const mockDispatch = vi.fn()
    const normalisedName = 'test.eth'
    const tokenId = labelhash('test')
    const selected = {} as any
    const item = {
      externalTransactionId: null,
    } as any
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ status: 'pending' }],
      })
    })

    const { result } = renderHook(() =>
      useMoonpayRegistration(mockDispatch, normalisedName, selected, item),
    )

    result.current.initiateMoonpayRegistrationMutation.mutate(registrationDuration)
    await waitFor(
      () =>
        expect(global.fetch).toHaveBeenCalledWith(
          `${MOONPAY_WORKER_URL[chainId]}/signedurl?tokenId=${tokenId}&name=${normalisedName}&duration=${registrationDuration}&walletAddress=0x123`,
        ),
      { timeout: 2000 },
    )
  })
})
