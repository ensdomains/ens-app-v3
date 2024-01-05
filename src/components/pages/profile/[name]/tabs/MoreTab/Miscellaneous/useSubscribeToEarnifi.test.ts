import { act, renderHook } from '@app/test-utils'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import fetch, { Request, Response } from 'node-fetch'

import { EARNIFI_ENDPOINT, getErrorMessage, useSubscribeToEarnifi } from './useSubscribeToEarnifi'

export const handlers = [
  rest.post(EARNIFI_ENDPOINT, (req, res, ctx) => {
    const { email, address, chainId } = req.body
    if (email && address && chainId) {
      return res(ctx.status(200))
    }
    return res(ctx.status(400), ctx.json({ message: 'Bad Request' }))
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
    global.fetch = fetch
    global.Request = Request
    global.Response = Response
    server.listen()
  })

  afterAll(async () => {
    delete global.fetch
    delete global.Request
    delete global.Response
    if (server && typeof server.close === 'function') {
      // Add a check to make sure server is defined and has a close method
      // server.close()
    }
  })
  afterEach(() => server.resetHandlers())

  it('should return a successful response when subscribing with valid data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSubscribeToEarnifi({}))

    act(() => {
      result.current.subscribe({
        email: 'test@example.com',
        address: '0x1234567890123456789012345678901234567890',
        chainId: 1,
      })
    })

    await waitForNextUpdate()
    expect(result.current.isSuccess).toBe(true)
  })

  it('should call onError function when there is a server error', async () => {
    const onError = jest.fn()
    const { result, waitForNextUpdate } = renderHook(() => useSubscribeToEarnifi({ onError }))

    // Simulate a server error
    result.current.subscribe({
      email: 'test@example.com',
      chainId: 1,
      address: '',
    })
    await waitForNextUpdate()

    // Check if the onError function was called
    expect(onError).toHaveBeenCalled()
  })
})
