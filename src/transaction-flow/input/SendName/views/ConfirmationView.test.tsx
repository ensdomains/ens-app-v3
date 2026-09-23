import { render, screen, userEvent } from '@app/test-utils'

import { beforeAll, describe, expect, it, vi } from 'vitest'

import { ConfirmationView } from './ConfirmationView'

beforeAll(() => {
  window.IntersectionObserver = vi.fn().mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }) as unknown as typeof IntersectionObserver
})

describe('ConfirmationView', () => {
  it('submits when not loading', async () => {
    const onSubmit = vi.fn()
    render(<ConfirmationView onSubmit={onSubmit} onBack={() => {}} />)
    await userEvent.click(screen.getByTestId('send-name-confirm-button'))
    expect(onSubmit).toHaveBeenCalled()
  })

  it('disables confirmation and does not submit while loading', async () => {
    const onSubmit = vi.fn()
    render(<ConfirmationView onSubmit={onSubmit} onBack={() => {}} loading />)
    const button = screen.getByTestId('send-name-confirm-button')
    expect(button).toBeDisabled()
    await userEvent.click(button)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
