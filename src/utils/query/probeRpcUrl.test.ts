import { BaseError, createPublicClient } from 'viem'
import { afterEach, describe, expect, it, Mock, vi } from 'vitest'

import { classifyProbeError, PROBE_TIMEOUT, probeRpcUrl } from './probeRpcUrl'

vi.mock('viem', async (importOriginal) => {
  const actual = await importOriginal<typeof import('viem')>()
  return { ...actual, createPublicClient: vi.fn() }
})

const mockGetChainId = (impl: () => Promise<number>) => {
  ;(createPublicClient as unknown as Mock).mockReturnValue({ getChainId: impl })
}

const namedError = (name: string) => Object.assign(new Error(name), { name })
// A real viem BaseError with a cause chain — the shape createPublicClient().getChainId()
// actually throws, exercising classifyProbeError's `err instanceof BaseError` / `.walk()` path.
const baseErrorWithCause = (causeName: string) =>
  new BaseError('request failed', { cause: namedError(causeName) })

describe('probeRpcUrl', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('succeeds when the endpoint reports the expected chain', async () => {
    mockGetChainId(() => Promise.resolve(1))
    await expect(probeRpcUrl({ url: 'https://a.example', chainId: 1 })).resolves.toEqual({
      success: true,
    })
  })

  it('builds the client transport with the given url, a short timeout and no retries', async () => {
    let captured: { transport: (opts: object) => { config: Record<string, unknown>; value: { url?: string } } } | undefined
    ;(createPublicClient as unknown as Mock).mockImplementation((config) => {
      captured = config
      return { getChainId: () => Promise.resolve(1) }
    })

    await probeRpcUrl({ url: 'https://only-this.example', chainId: 1 })

    const transport = captured!.transport({})
    expect(transport.config.type).toBe('http')
    expect(transport.value.url).toBe('https://only-this.example')
    expect(transport.config.timeout).toBe(PROBE_TIMEOUT)
    expect(transport.config.retryCount).toBe(0)
  })

  it('classifies a real nested viem error (BaseError with a cause) via err.walk', async () => {
    mockGetChainId(() => Promise.reject(baseErrorWithCause('TimeoutError')))
    await expect(probeRpcUrl({ url: 'https://a.example', chainId: 1 })).resolves.toEqual({
      success: false,
      reason: 'timeout',
    })
  })

  it('fails with wrongChain and reports the mismatched id', async () => {
    mockGetChainId(() => Promise.resolve(11155111))
    await expect(probeRpcUrl({ url: 'https://a.example', chainId: 1 })).resolves.toEqual({
      success: false,
      reason: 'wrongChain',
      reportedChainId: 11155111,
    })
  })

  it('classifies a network/CORS failure as unreachable', async () => {
    mockGetChainId(() => Promise.reject(namedError('HttpRequestError')))
    await expect(probeRpcUrl({ url: 'https://a.example', chainId: 1 })).resolves.toEqual({
      success: false,
      reason: 'unreachable',
    })
  })

  it('classifies a timeout', async () => {
    mockGetChainId(() => Promise.reject(namedError('TimeoutError')))
    await expect(probeRpcUrl({ url: 'https://a.example', chainId: 1 })).resolves.toEqual({
      success: false,
      reason: 'timeout',
    })
  })

  it('classifies anything else as an invalid response', async () => {
    mockGetChainId(() => Promise.reject(new Error('unexpected <html> response')))
    await expect(probeRpcUrl({ url: 'https://a.example', chainId: 1 })).resolves.toEqual({
      success: false,
      reason: 'invalidResponse',
    })
  })
})

describe('classifyProbeError', () => {
  it.each([
    ['TimeoutError', 'timeout'],
    ['HttpRequestError', 'unreachable'],
    ['SomethingElse', 'invalidResponse'],
  ] as const)('classifies a %s-named error as %s', (name, expected) => {
    expect(classifyProbeError(namedError(name))).toBe(expected)
  })

  it('classifies a plain object without a name as invalidResponse', () => {
    expect(classifyProbeError({})).toBe('invalidResponse')
    expect(classifyProbeError(null)).toBe('invalidResponse')
  })

  // The production path: viem throws BaseError subclasses, so the `instanceof BaseError` /
  // `err.walk()` branch must be exercised, not just the plain-Error fallback.
  it.each([
    ['TimeoutError', 'timeout'],
    ['HttpRequestError', 'unreachable'],
    ['SomethingElse', 'invalidResponse'],
  ] as const)('walks a BaseError cause chain to classify %s as %s', (causeName, expected) => {
    const err = baseErrorWithCause(causeName)
    expect(err).toBeInstanceOf(BaseError)
    expect(classifyProbeError(err)).toBe(expected)
  })

  it('walks a deeply nested BaseError chain to find the timeout', () => {
    const deep = new BaseError('outer', { cause: baseErrorWithCause('TimeoutError') })
    expect(classifyProbeError(deep)).toBe('timeout')
  })
})
