import { render, screen, userEvent } from '@app/test-utils'

import { ConfirmationDialogView } from './ConfirmationDialogView'

const mockOnConfirm = jest.fn()
const mockOnDecline = jest.fn()

describe('ConfirmationDialogView', () => {
  it('should render', () => {
    render(
      <ConfirmationDialogView
        title="Test title"
        description="Test description"
        confirmLabel="Test confirm"
        declineLabel="Test decline"
        onConfirm={mockOnConfirm}
        onDecline={mockOnDecline}
      />,
    )

    expect(screen.getByText('Test title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByTestId('confirmation-dialog-confirm-button')).toHaveTextContent(
      'Test confirm',
    )
    expect(screen.getByTestId('confirmation-dialog-decline-button')).toHaveTextContent(
      'Test decline',
    )
  })

  it('should call onConfirm when clicked', async () => {
    render(
      <ConfirmationDialogView
        title="Test title"
        description="Test description"
        confirmLabel="Test confirm"
        declineLabel="Test decline"
        onConfirm={mockOnConfirm}
        onDecline={mockOnDecline}
      />,
    )
    await userEvent.click(screen.getByTestId('confirmation-dialog-confirm-button'))
    expect(mockOnConfirm).toHaveBeenCalled()
  })

  it('should call onDecline when clicked', async () => {
    render(
      <ConfirmationDialogView
        title="Test title"
        description="Test description"
        confirmLabel="Test confirm"
        declineLabel="Test decline"
        onConfirm={mockOnConfirm}
        onDecline={mockOnDecline}
      />,
    )
    await userEvent.click(screen.getByTestId('confirmation-dialog-decline-button'))
    expect(mockOnDecline).toHaveBeenCalled()
  })
})
