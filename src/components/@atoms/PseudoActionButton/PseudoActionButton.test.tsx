import { act, render, screen, userEvent, waitFor } from '@app/test-utils'

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { PseudoActionButton } from './PseudoActionButton'

beforeAll(() => {
  vi.useFakeTimers()
})

afterAll(() => {
  vi.useRealTimers()
})

describe('PseudoActionButton', () => {
  it('should show loading state when clicked and reset after timeout has been run', async () => {
    const testIcon = () => <div data-testid="icon" />
    render(
      <PseudoActionButton prefix={testIcon} timeout={500}>
        Test
      </PseudoActionButton>,
    )
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const button = screen.getByRole('button', { name: /Test/i })
    const icon = screen.getByTestId('icon')
    expect(icon).toBeVisible()
    await user.click(button)
    expect(icon).not.toBeVisible()
    act(() => {
      vi.runAllTimers()
    })
    await waitFor(() => {
      expect(screen.getByTestId('icon')).toBeVisible()
    })
  })

  it('should maintain loading state if loading is set to true', async () => {
    const testIcon = () => <div data-testid="icon" />
    render(
      <PseudoActionButton loading prefix={testIcon} timeout={500}>
        Test
      </PseudoActionButton>,
    )
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const button = screen.getByRole('button', { name: /Test/i })
    expect(screen.queryByTestId('icon')).toEqual(null)
    await user.click(button)
    expect(screen.queryByTestId('icon')).toEqual(null)
    act(() => {
      vi.runAllTimers()
    })
    expect(screen.queryByTestId('icon')).toEqual(null)
  })
})
