import { render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import ErrorScreen from './ErrorScreen'

describe('ErrorScreen', () => {
  it('renders not-found error correctly', () => {
    render(<ErrorScreen errorType="not-found" />)
    expect(screen.findAllByText('Not found')).toBeTruthy()
    expect(screen.getByTestId('question-circle-svg')).toBeVisible()
  })

  it('renders application-error correctly', () => {
    render(<ErrorScreen errorType="application-error" />)
    expect(screen.findAllByText('Application error')).toBeTruthy()
    expect(screen.getByTestId('alert-svg')).toBeVisible()
  })
})
