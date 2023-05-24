import { act, fireEvent, render, screen, userEvent, waitFor } from '@app/test-utils'

import { EarnifiDialog } from './EarnifiDialog'
import { useSubscribeToEarnifi } from './useSubscribeToEarnifi'

jest.mock('./useSubscribeToEarnifi', () => ({
  useSubscribeToEarnifi: jest.fn(),
}))

const pageObject = {
  emailInput: () => screen.getByLabelText('action.enterEmail'),
  continueButton: () => screen.getByRole('button', { name: 'action.continue' }),
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

    await act(async () => {
      await userEvent.type(pageObject.emailInput(), 'invalid-email')
      userEvent.click(pageObject.continueButton())
    })

    expect(await screen.findByText('errors.emailInvalid')).toBeInTheDocument()
  })

  it('should disable button when loading', async () => {
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: jest.fn(),
      status: 'loading',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await act(async () => {
      await userEvent.type(pageObject.emailInput(), 'valid-email@example.com')
      userEvent.click(pageObject.continueButton())
    })

    expect(pageObject.continueButton()).toBeDisabled()
  })

  it('should call subscribe with the correct information', async () => {
    const subscribeMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockReturnValue({
      subscribe: subscribeMock,
      status: 'idle',
    })

    render(<EarnifiDialog {...defaultProps} />)

    await act(async () => {
      await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
      fireEvent.click(pageObject.continueButton())
    })

    expect(subscribeMock).toHaveBeenCalledWith({
      address: 'name',
      chainId: 'mainnet',
      email: 'validemail@example.com',
    })
  })

  it('should show error message when one is passed', async () => {
    const subscribeMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error('Bad Request')),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await act(async () => {
      await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
      fireEvent.click(pageObject.continueButton())
    })

    expect(await screen.findByText('Bad Request')).toBeInTheDocument()
  })

  it('should show default error when no error message is passed', async () => {
    const subscribeMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error()),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await act(async () => {
      await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
      fireEvent.click(pageObject.continueButton())
    })

    expect(await screen.findByText('tabs.more.misc.earnfi.submitError')).toBeInTheDocument()
  })

  it('should clear error after error timeout', async () => {
    const subscribeMock = jest.fn()
    ;(useSubscribeToEarnifi as jest.Mock).mockImplementation(({ onError }) => ({
      subscribe: () => onError(new Error()),
      status: 'idle',
    }))

    render(<EarnifiDialog {...defaultProps} />)

    await act(async () => {
      await userEvent.type(pageObject.emailInput(), 'validemail@example.com')
      fireEvent.click(pageObject.continueButton())
    })

    expect(await screen.findByText('tabs.more.misc.earnfi.submitError')).toBeInTheDocument()
    setTimeout(async () => {
      await waitFor(() => {
        expect(screen.findByText('tabs.more.misc.earnfi.submitError')).not.toBeInTheDocument()
      })
    }, 3000)
  })
})
