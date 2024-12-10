import { fireEvent, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import BurnFusesContent, { canContinue, childFuseObj } from './BurnFusesContent'

vi.mock('@ensdomains/ensjs/utils', () => ({
  ChildFuseKeys: ['CANNOT_UNWRAP', 'CANNOT_TRANSFER', 'CANNOT_SET_RESOLVER'],
  ChildFuseReferenceType: {
    Key: 'string',
  },
}))

describe('BurnFusesContent', () => {
  const mockOnSubmit = vi.fn()
  const mockOnDismiss = vi.fn()

  const defaultProps = {
    fuseData: childFuseObj,
    onDismiss: mockOnDismiss,
    onSubmit: mockOnSubmit,
    canUnsetFuse: false,
  }

  it('renders correctly', () => {
    render(<BurnFusesContent {...defaultProps} />)

    expect(screen.getByText('fuses.burnFormTitle')).toBeInTheDocument()
    expect(screen.getAllByTestId(/burn-button-/)).toHaveLength(Object.keys(childFuseObj).length)
  })

  it('handles burn button click', () => {
    render(<BurnFusesContent {...defaultProps} />)

    const burnButton = screen.getByTestId('burn-button-CANNOT_UNWRAP')
    fireEvent.click(burnButton)

    const flameIcon = screen.getByTestId('flame-selected-CANNOT_UNWRAP')
    expect(flameIcon).toBeInTheDocument()
  })

  it('disables submit button if no fuses are selected', () => {
    render(<BurnFusesContent {...defaultProps} />)

    const submitButton = screen.getByTestId('burn-form-continue')
    expect(submitButton).toBeDisabled()
  })

  it('calls onSubmit with correct data', () => {
    render(
      <BurnFusesContent
        {...{
          ...defaultProps,
          fuseData: {
            ...defaultProps.fuseData,
            CANNOT_TRANSFER: true,
          },
          canUnsetFuse: true,
        }}
      />,
    )

    fireEvent.click(screen.getByTestId('burn-button-CANNOT_UNWRAP'))
    fireEvent.click(screen.getByTestId('burn-button-CANNOT_SET_RESOLVER'))

    const submitButton = screen.getByTestId('burn-form-continue')
    fireEvent.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith(
      ['CANNOT_UNWRAP', 'CANNOT_TRANSFER', 'CANNOT_SET_RESOLVER'],
      [
        'fuses.permissions.CANNOT_UNWRAP',
        'fuses.permissions.CANNOT_TRANSFER',
        'fuses.permissions.CANNOT_SET_RESOLVER',
      ],
    )
  })

  it('calls onDismiss when cancel is clicked', () => {
    render(<BurnFusesContent {...defaultProps} />)

    const cancelButton = screen.getByText('action.cancel')
    fireEvent.click(cancelButton)

    expect(mockOnDismiss).toHaveBeenCalled()
  })
})

describe('canContinue', () => {
  it('should return false if "fuseData" & "fuseSelected" are equal and "canUnsetFuse" is false', () => {
    const result = canContinue(
      {
        CANNOT_UNWRAP: true,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      {
        CANNOT_UNWRAP: true,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      false,
    )

    expect(result).toBe(false)
  })

  it('should return false if "fuseData" & "fuseSelected" are equal and "canUnsetFuse" is true', () => {
    const result = canContinue(
      {
        CANNOT_UNWRAP: true,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      {
        CANNOT_UNWRAP: true,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      true,
    )

    expect(result).toBe(false)
  })

  it('should return true if "fuseData" & "fuseSelected" are not equal and "canUnsetFuse" is true', () => {
    const result = canContinue(
      {
        CANNOT_UNWRAP: true,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      {
        CANNOT_UNWRAP: false,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      true,
    )

    expect(result).toBe(true)
  })

  it('should return false if "fuseData" & "fuseSelected" are not equal and "canUnsetFuse" is false', () => {
    const result = canContinue(
      {
        CANNOT_UNWRAP: true,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      {
        CANNOT_UNWRAP: false,
        CANNOT_TRANSFER: true,
        CANNOT_SET_RESOLVER: true,
      } as typeof childFuseObj,
      false,
    )

    expect(result).toBe(false)
  })
})
