import { fireEvent, render } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import useDebounce from './useDebounce'

function TestComponent() {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 1000)

  return (
    <div>
      <input data-testid="input" value={value} onChange={(e) => setValue(e.target.value)} />
      <span data-testid="debouncedValue">{debouncedValue}</span>
      <span data-testid="value">{value}</span>
    </div>
  )
}

describe('useDebouncedValue', function () {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should debounce and only change value when delay time has passed', async () => {
    const { getByTestId } = render(<TestComponent />)
    const input = getByTestId('input')
    const debouncedValue = getByTestId('debouncedValue')
    const value = getByTestId('value')

    fireEvent.change(input, { target: { value: 't' } })
    await vi.advanceTimersByTime(100)
    expect(debouncedValue.textContent).toBe('')
    expect(value.textContent).toBe('t')

    fireEvent.change(input, { target: { value: 'tes' } })
    await vi.advanceTimersByTime(500)
    expect(debouncedValue.textContent).toBe('')
    expect(value.textContent).toBe('tes')

    fireEvent.change(input, { target: { value: 'test' } })
    await vi.advanceTimersByTime(999)
    expect(debouncedValue.textContent).toBe('')
    expect(value.textContent).toBe('test')

    await vi.advanceTimersByTime(1)
    expect(debouncedValue.textContent).toBe('test')
    expect(value.textContent).toBe('test')
  })
})
