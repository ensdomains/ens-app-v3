import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

beforeAll(() => {
  Object.defineProperty(window.HTMLInputElement.prototype, 'showPicker', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  })
})
