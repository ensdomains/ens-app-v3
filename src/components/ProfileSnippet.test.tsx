import '@app/test-utils'

import { render, screen } from '@app/test-utils'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'

import { ProfileSnippet, getUserDefinedUrl } from './ProfileSnippet'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({ data: { canEdit: false } }),
}))

vi.mock('@app/hooks/useBeautifiedName', () => ({
  useBeautifiedName: (name: string) => name,
}))

vi.mock('@app/hooks/useRouterWithHistory', () => ({
  useRouterWithHistory: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('../transaction-flow/TransactionFlowProvider', () => ({
  useTransactionFlow: () => ({
    usePreparedDataInput: () => vi.fn(),
  }),
}))

describe('ProfileSnippet', () => {
  it('should render warning when hasMismatch is true', () => {
    render(
      <ProfileSnippet
        name="MetaMask.eth"
        hasMismatch={true}
      />
    )
    
    expect(screen.getByText('name.unnormalized')).toBeInTheDocument()
  })
  
  it('should show View Profile button even when hasMismatch is true', () => {
    render(
      <ProfileSnippet
        name="MetaMask.eth"
        button="viewProfile"
        hasMismatch={true}
      />
    )
    
    expect(screen.queryByText('wallet.viewProfile')).toBeInTheDocument()
  })
  
  it('should show primary name tag when isPrimary is true and no mismatch', () => {
    render(
      <ProfileSnippet
        name="test.eth"
        isPrimary={true}
        hasMismatch={false}
      />
    )
    
    expect(screen.getByText('name.yourPrimaryName')).toBeInTheDocument()
  })
  
  it('should not beautify name when hasMismatch is true', () => {
    const { container } = render(
      <ProfileSnippet
        name="MetaMask.eth"
        hasMismatch={true}
      />
    )
    
    // The name should be displayed as-is without beautification
    const nameElement = container.querySelector('[data-testid="profile-snippet-name"]')
    expect(nameElement?.textContent).toBe('MetaMask.eth')
  })
  
  it('should render both primary tag and warning when both conditions are true', () => {
    render(
      <ProfileSnippet
        name="MetaMask.eth"
        isPrimary={true}
        hasMismatch={true}
      />
    )
    
    expect(screen.getByText('name.yourPrimaryName')).toBeInTheDocument()
    expect(screen.getByText('name.unnormalized')).toBeInTheDocument()
  })
})

describe('getUserDefinedUrl', () => {
  it('should return undefined if no URL is provided', () => {
    expect(getUserDefinedUrl()).toBeUndefined()
  })

  it('should return the input URL if it starts with http://', () => {
    expect(getUserDefinedUrl('http://example.com')).toBe('http://example.com')
  })

  it('should return the input URL if it starts with https://', () => {
    expect(getUserDefinedUrl('https://example.com')).toBe('https://example.com')
  })

  it('should return an empty string if the input URL does not start with http:// or https://', () => {
    expect(getUserDefinedUrl('example.com')).toBe('')
  })

  it('should replace javascript: with empty string', () => {
    // eslint-disable-next-line no-script-url
    expect(getUserDefinedUrl('javascript:alert("hello")')).toBe('')
  })
})
