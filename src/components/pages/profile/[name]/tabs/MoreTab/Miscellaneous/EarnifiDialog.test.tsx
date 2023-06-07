import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { EarnifiDialog } from './EarnifiDialog'
import { useSubscribeToEarnifi } from './useSubscribeToEarnifi'

jest.mock('./useSubscribeToEarnifi', () => ({
  useSubscribeToEarnifi: jest.fn(),
}))

const pageObject = {
  emailInput: () => screen.getByLabelText('action.enterEmail'),
  continueButton: () => screen.getByRole('button', { name: 'action.continue' }),
  cancelButton: () => screen.getByRole('button', { name: 'action.cancel' }),
}

const defaultProps = {
  name: 'name',
  open: true,
  onDismiss: jest.fn(),
}

describe('EarnifiDialog', () => {
  beforeEach(() => {
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: jest.fn(),
      status: 'idle',
    })
  })
  it('should render', () => {
    render(<EarnifiDialog {...defaultProps} open={false} />)
  })

  it('should render dialog when open is true', () => {
    render(<EarnifiDialog {...defaultProps} />)
    const dialog = screen.getByText('tabs.more.misc.earnfi.title')
    expect(dialog).toBeInTheDocument()
  })

  it('should show error if email address is invalid', async () => {
    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'invalid-email')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('errors.emailInvalid')).toBeInTheDocument()
  })

  it('should disable button when loading', async () => {
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: jest.fn(),
      status: 'loading',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'valid-email@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(pageObject.continueButton()).toBeDisabled()
  })

  it('should call subscribe with the correct information', async () => {
    const subscribeMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
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
    ;(useSubscribeToEarnifi as jest.Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error('Bad Request')),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('Bad Request')).toBeInTheDocument()
  })

  it('should show default error when no error message is passed', async () => {
    ;(useSubscribeToEarnifi as jest.Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error()),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('tabs.more.misc.earnfi.submitError')).toBeInTheDocument()
  })

  it('should clear error after error timeout', async () => {
    ;(useSubscribeToEarnifi as jest.Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error()),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
    await userEvent.click(pageObject.continueButton())

    expect(await screen.findByText('tabs.more.misc.earnfi.submitError')).toBeInTheDocument()
    setTimeout(async () => {
      await waitFor(() => {
        expect(screen.findByText('tabs.more.misc.earnfi.submitError')).not.toBeInTheDocument()
      })
    }, 3000)
  })

  it('should call _onDismiss when modal is cancelled on email input', async () => {
    const onDismissMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: jest.fn(),
      status: 'idle',
      reset: jest.fn(),
    })

    render(<EarnifiDialog {...{ ...defaultProps, onDismiss: onDismissMock }} />)

    await userEvent.click(pageObject.cancelButton())

    await waitFor(() => expect(onDismissMock).toHaveBeenCalled())
  })

  it('should show success dialog when subscribe is successful', async () => {
    const subscribeMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: subscribeMock,
      status: 'success',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await waitFor(() =>
      expect(screen.getByText('tabs.more.misc.earnfi.emailConfirmation')).toBeInTheDocument(),
    )
  })

  it('should call _onDismiss when modal is closed on success dialog', async () => {
    const onDismissMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: jest.fn(),
      status: 'success',
      reset: jest.fn(),
    })

    render(<EarnifiDialog {...{ ...defaultProps, onDismiss: onDismissMock }} />)

    await waitFor(() =>
      expect(screen.getByText('tabs.more.misc.earnfi.emailConfirmation')).toBeInTheDocument(),
    )

    await userEvent.click(screen.getByRole('button', { name: 'action.close' }))

    await waitFor(() => expect(onDismissMock).toHaveBeenCalled())
  })

  it('_onDismiss should call reset', async () => {
    const resetMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: jest.fn(),
      status: 'idle',
      reset: resetMock,
    })

    render(<EarnifiDialog {...defaultProps} />)

    await userEvent.click(pageObject.cancelButton())

    await waitFor(() => expect(resetMock).toHaveBeenCalled())
  })
})
