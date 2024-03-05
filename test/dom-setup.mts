import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

beforeAll(() => {
  Object.defineProperty(window.HTMLInputElement.prototype, 'showPicker', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  })
})
