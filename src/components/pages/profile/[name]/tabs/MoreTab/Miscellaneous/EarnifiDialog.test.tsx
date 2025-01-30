import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'

import { makeMockIntersectionObserver } from '../../../../../../../../test/mock/makeMockIntersectionObserver'
import { EarnifiDialog } from './EarnifiDialog'
import { useSubscribeToEarnifi } from './useSubscribeToEarnifi'

vi.mock('./useSubscribeToEarnifi', () => ({
  useSubscribeToEarnifi: vi.fn(),
}))

makeMockIntersectionObserver()

const pageObject = {
  emailInput: () => screen.getByLabelText('action.enterEmail'),
  continueButton: () => screen.getByRole('button', { name: 'action.continue' }),
  cancelButton: () => screen.getByRole('button', { name: 'action.cancel' }),
}

const defaultProps = {
  name: 'name',
  open: true,
  onDismiss: vi.fn(),
}

describe('EarnifiDialog', () => {
  beforeEach(() => {
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: vi.fn(),
      status: 'idle',
    })
  })
  it('should render', () => {
    render(<EarnifiDialog {...defaultProps} open={false} />)
    expect(screen.queryByText('tabs.more.misc.bankless.title')).not.toBeInTheDocument()
  })

  it('should render dialog when open is true', () => {
    render(<EarnifiDialog {...defaultProps} />)
    const dialog = screen.getByText('tabs.more.misc.bankless.title')
    expect(dialog).toBeInTheDocument()
  })

  it('should show error if email address is invalid', async () => {
    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'invalid-email')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('errors.emailInvalid')).toBeInTheDocument()
  })

  it('should disable button when loading', async () => {
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: vi.fn(),
      status: 'pending',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'valid-email@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(pageObject.continueButton()).toBeDisabled()
  })

  it('should call subscribe with the correct information', async () => {
    const subscribeMock = vi.fn()
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: subscribeMock,
      status: 'idle',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(subscribeMock).toHaveBeenCalledWith({
      address: 'name',
      chainId: 1,
      email: 'validemail@example.com',
    })
  })

  it('should show error message when one is passed', async () => {
    ;(useSubscribeToEarnifi as Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error('Bad Request')),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('Bad Request')).toBeInTheDocument()
  })

  it('should show default error when no error message is passed', async () => {
    ;(useSubscribeToEarnifi as Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error()),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('tabs.more.misc.bankless.submitError')).toBeInTheDocument()
  })

  it('should clear error after error timeout', async () => {
    ;(useSubscribeToEarnifi as Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error()),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('tabs.more.misc.bankless.submitError')).toBeInTheDocument()
    setTimeout(async () => {
      await waitFor(() => {
        expect(screen.findByText('tabs.more.misc.bankless.submitError')).not.toBeInTheDocument()
      })
    }, 3000)
  })

  it('should call _onDismiss when modal is cancelled on email input', async () => {
    const onDismissMock = vi.fn()
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: vi.fn(),
      status: 'idle',
      reset: vi.fn(),
    })

    render(<EarnifiDialog {...{ ...defaultProps, onDismiss: onDismissMock }} />)

    await userEvent.click(pageObject.cancelButton())

    await waitFor(() => expect(onDismissMock).toHaveBeenCalled())
  })

  it('should show success dialog when subscribe is successful', async () => {
    const subscribeMock = vi.fn()
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: subscribeMock,
      status: 'success',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await waitFor(() =>
      expect(screen.getByText('tabs.more.misc.bankless.emailConfirmation')).toBeInTheDocument(),
    )
  })

  it('should call _onDismiss when modal is closed on success dialog', async () => {
    const onDismissMock = vi.fn()
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: vi.fn(),
      status: 'success',
      reset: vi.fn(),
    })

    render(<EarnifiDialog {...{ ...defaultProps, onDismiss: onDismissMock }} />)

    await waitFor(() =>
      expect(screen.getByText('tabs.more.misc.bankless.emailConfirmation')).toBeInTheDocument(),
    )

    await userEvent.click(screen.getByRole('button', { name: 'action.close' }))

    await waitFor(() => expect(onDismissMock).toHaveBeenCalled())
  })

  it('_onDismiss should call reset', async () => {
    const resetMock = vi.fn()
    ;(useSubscribeToEarnifi as Mock).mockReturnValue({
      subscribe: vi.fn(),
      status: 'idle',
      reset: resetMock,
    })

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.click(pageObject.cancelButton())

    await waitFor(() => expect(resetMock).toHaveBeenCalled())
  })
})
