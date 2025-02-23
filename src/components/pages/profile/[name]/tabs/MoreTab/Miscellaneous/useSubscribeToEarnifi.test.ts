import { act, renderHook, waitFor } from '@app/test-utils'

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it, test, vi } from 'vitest'

import { EARNIFI_ENDPOINT, getErrorMessage, useSubscribeToEarnifi } from './useSubscribeToEarnifi'

export const handlers = [
  http.post(EARNIFI_ENDPOINT, async ({ request }) => {
    const { email, address, chainId } = (await request.json()) as Record<string, string>
    if (email && address && chainId) {
      return HttpResponse.json({}, { status: 200 })
    }
    return HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
  }),
]

export const server = setupServer(...handlers)

describe('getErrorMessage', () => {
  test('returns undefined for non-JSON response', async () => {
    const response = new Response('Internal Server Error', { status: 500 })
    const errorMessage = await getErrorMessage(response)
    expect(errorMessage).toBeUndefined()
  })

  test('returns undefined for invalid JSON response', async () => {
    const response = new Response('{invalid json}', { status: 400 })
    const errorMessage = await getErrorMessage(response)
    expect(errorMessage).toBeUndefined()
  })

  test('returns message property for valid JSON response', async () => {
    const response = new Response(JSON.stringify({ message: 'Invalid address' }), { status: 400 })
    const errorMessage = await getErrorMessage(response)
    expect(errorMessage).toBe('Invalid address')
  })
})

describe('useSubscribeToEarnifi', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(async () => {
    if (server && typeof server.close === 'function') {
      // Add a check to make sure server is defined and has a close method
      server.close()
    }
  })
  afterEach(() => server.resetHandlers())

  it('should return a successful response when subscribing with valid data', async () => {
    const { result } = renderHook(() => useSubscribeToEarnifi({}))

    act(() => {
      result.current.subscribe({
        email: 'test@example.com',
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('should call onError function when there is a server error', async () => {
    const onError = vi.fn() as () => void
    const { result } = renderHook(() => useSubscribeToEarnifi({ onError }))

    // Simulate a server error
    result.current.subscribe({
      email: 'test@example.com',
      chainId: 1,
      address: '',
    })

    // Check if the onError function was called
    await waitFor(() => expect(onError).toHaveBeenCalled())
  })
})
