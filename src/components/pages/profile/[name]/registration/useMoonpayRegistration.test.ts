import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { labelhash } from '@ensdomains/ensjs/utils/labels'

import { useChainId } from '@app/hooks/useChainId'
import { MOONPAY_WORKER_URL } from '@app/utils/constants'

import { useMoonpayRegistration } from './useMoonpayRegistration'

jest.mock('@app/hooks/useChainId')

const mockUseChaindId = mockFunction(useChainId)

describe('useMoonpayRegistration', () => {
  it('should check up on transaction status every second if a there is a currentExternalTransactionId', async () => {
    mockUseChaindId.mockReturnValue(1)
    const mockDispatch = jest.fn()
    const normalisedName = 'test.eth'
    const selected = {}
    const item = {
      externalTransactionId: '0x123',
    }
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ message: 'uploaded' }],
      })
    })

    renderHook(() => useMoonpayRegistration(mockDispatch, normalisedName, selected, item))
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2), { timeout: 2000 })
  })
  it('should stop refetching once transaction is complete', async () => {
    mockUseChaindId.mockReturnValue(1)
    const mockDispatch = jest.fn()
    const normalisedName = 'test.eth'
    const selected = {}
    let item = {
      externalTransactionId: '0x123',
    }
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ status: 'pending' }],
      })
    })

    const { rerender, result } = renderHook(() =>
      useMoonpayRegistration(mockDispatch, normalisedName, selected, item),
    )
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2), { timeout: 2000 })

    global.fetch = jest.fn().mockImplementation(() => {
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
    mockUseChaindId.mockReturnValue(1)
    const mockDispatch = jest.fn()
    let normalisedName = 'test.eth'
    const selected = {}
    let item = {
      externalTransactionId: '0x123',
    }
    global.fetch = jest.fn().mockImplementation(() => {
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
    mockUseChaindId.mockReturnValue(chainId)
    const mockDispatch = jest.fn()
    const normalisedName = 'test.eth'
    const tokenId = labelhash('test')
    const selected = {}
    const item = {
      externalTransactionId: null,
    }
    global.fetch = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        json: () => [{ status: 'pending' }],
      })
    })

    const { result } = renderHook(() =>
      useMoonpayRegistration(mockDispatch, normalisedName, selected, item),
    )

    console.log('result: ', result.current)
    result.current.initiateMoonpayRegistrationMutation.mutate(registrationDuration)
    await waitFor(
      () =>
        expect(global.fetch).toHaveBeenCalledWith(
          `${MOONPAY_WORKER_URL[chainId]}/signedurl?tokenId=${tokenId}&name=${normalisedName}&duration=${registrationDuration}`,
        ),
      { timeout: 2000 },
    )
  })
})
