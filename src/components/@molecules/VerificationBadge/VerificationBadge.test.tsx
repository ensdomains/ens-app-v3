import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { VerificationBadge } from './VerificationBadge'

describe('VerificationBadge', () => {
  it('should render with with badge', () => {
    render(
      <VerificationBadge showBadge={true} type="record">
        <div></div>
      </VerificationBadge>,
    )
    expect(screen.getByTestId('verification-badge-record')).toBeInTheDocument()
  })

  it('should render with without badge', () => {
    render(
      <VerificationBadge showBadge={false} type="record">
        <div></div>
      </VerificationBadge>,
    )
    expect(screen.queryByTestId('verification-badge-record')).not.toBeInTheDocument()
  })

  it('should render with alert svg', () => {
    render(
      <VerificationBadge isVerified={false} showBadge={true} type="record">
        <div></div>
      </VerificationBadge>,
    )
    expect(screen.getByTestId('verification-badge-error-icon')).toBeInTheDocument()
  })

  it('should render with verified svg', () => {
    render(
      <VerificationBadge isVerified={true} showBadge={true} type="record">
        <div></div>
      </VerificationBadge>,
    )
    expect(screen.getByTestId('verification-badge-record-icon')).toBeInTheDocument()
  })

  it('should render with personhood svg', () => {
    render(
      <VerificationBadge isVerified={true} showBadge={true} type="personhood">
        <div></div>
      </VerificationBadge>,
    )
    expect(screen.getByTestId('verification-badge-person-icon')).toBeInTheDocument()
  })
})
