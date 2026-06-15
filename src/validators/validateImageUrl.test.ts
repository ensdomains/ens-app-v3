import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { imageUrlReturnsImage } from './validateImageUrl'

// Behaviour of the mocked `new Image()` for the current test:
// - 'load'  → fire onload asynchronously (resolves true)
// - 'error' → fire onerror asynchronously (resolves false)
// - 'hang'  → never fire either (exercises the timeout path)
let imageBehavior: 'load' | 'error' | 'hang' = 'load'

class MockImage {
  onload: (() => void) | null = null

  onerror: (() => void) | null = null

  // eslint-disable-next-line accessor-pairs
  set src(_value: string) {
    if (imageBehavior === 'load') queueMicrotask(() => this.onload?.())
    else if (imageBehavior === 'error') queueMicrotask(() => this.onerror?.())
    // 'hang' → intentionally never resolves
  }
}

beforeEach(() => {
  imageBehavior = 'load'
  vi.stubGlobal('Image', MockImage)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('imageUrlReturnsImage', () => {
  it('resolves true for an https URL that loads as an image', async () => {
    imageBehavior = 'load'
    await expect(imageUrlReturnsImage('https://example.com/avatar.png')).resolves.toBe(true)
  })

  it('resolves false for an https URL that fails to load', async () => {
    imageBehavior = 'error'
    await expect(imageUrlReturnsImage('https://www.instagram.com/')).resolves.toBe(false)
  })

  it('resolves true for a data:image URL that loads', async () => {
    imageBehavior = 'load'
    await expect(
      imageUrlReturnsImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ'),
    ).resolves.toBe(true)
  })

  it('resolves false for a non-image data URL that fails to load', async () => {
    imageBehavior = 'error'
    await expect(imageUrlReturnsImage('data:text/html,<h1>not an image</h1>')).resolves.toBe(false)
  })

  it('resolves false when the image load times out', async () => {
    imageBehavior = 'hang'
    vi.useFakeTimers()
    const promise = imageUrlReturnsImage('https://example.com/slow.png', 1000)
    await vi.advanceTimersByTimeAsync(1000)
    await expect(promise).resolves.toBe(false)
  })

  it('resolves true for ipfs URLs without attempting an image load (out of scope)', async () => {
    imageBehavior = 'error'
    await expect(imageUrlReturnsImage('ipfs://bafybeibexampleexampleexample')).resolves.toBe(true)
  })

  it('resolves true for eip155 URLs without attempting an image load (out of scope)', async () => {
    imageBehavior = 'error'
    await expect(
      imageUrlReturnsImage('eip155:1/erc721:0x0000000000000000000000000000000000000000/1'),
    ).resolves.toBe(true)
  })

  it('resolves false for an unparseable URL', async () => {
    await expect(imageUrlReturnsImage('not a url')).resolves.toBe(false)
  })

  it('resolves false for an unsupported protocol', async () => {
    await expect(imageUrlReturnsImage('ftp://example.com/avatar.png')).resolves.toBe(false)
  })
})
