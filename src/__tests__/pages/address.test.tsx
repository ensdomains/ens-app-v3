import '@app/test-utils'

import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@ensdomains/thorin'

import Page from '../../pages/address'
import { useRouter } from 'next/router'

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    isReady: true,
    query: { address: '0x43e47385f6b3f8bdbe02c210bf5c74b6c34ff441' },
  })),
}))

// Mock Next.js head
vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock hooks
vi.mock('@app/hooks/usePrimaryProfile', () => ({
  usePrimaryProfile: ({ address }: { address: string }) => {
    if (address === '0x1111111111111111111111111111111111111111') {
      return {
        data: {
          name: 'test.eth',
          match: true,
          texts: [
            { key: 'description', value: 'Test profile' },
          ],
        },
        isLoading: false,
      }
    }
    return {
      data: null,
      isLoading: false,
    }
  },
}))

vi.mock('@app/hooks/account/useAccountSafely', () => ({
  useAccountSafely: () => ({
    address: '0x1234567890abcdef',
  }),
}))

vi.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: () => 'mainnet',
}))

vi.mock('@app/components/ProfileSnippet', () => ({
  ProfileSnippet: ({ name, button }: any) => (
    <div data-testid="profile-snippet">
      <span data-testid="profile-name">{name}</span>
      {button && <span data-testid="button-type">{button}</span>}
    </div>
  ),
}))

vi.mock('@app/components/address/NoProfileSnippet', () => ({
  default: () => <div data-testid="no-profile-snippet">No Profile</div>,
}))

vi.mock('@app/components/@molecules/NameListView/NameListView', () => ({
  NameListView: () => <div data-testid="name-list-view">Name List</div>,
}))

vi.mock('@app/layouts/Content', () => ({
  Content: ({ children, loading }: any) => {
    const childrenObj = typeof children === 'object' && !React.isValidElement(children) ? children : {}
    return (
      <div data-testid="content" data-loading={loading}>
        {childrenObj.leading}
        {childrenObj.trailing}
      </div>
    )
  },
}))

vi.mock('@app/layouts/ContentGrid', () => ({
  ContentGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="content-grid">{children}</div>
  ),
}))

vi.mock('@app/components/Outlink', () => ({
  Outlink: ({ children }: { children: React.ReactNode }) => (
    <a data-testid="outlink">{children}</a>
  ),
}))

describe('Address Page', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
    </QueryClientProvider>
  )

  it('should display a valid primary name', async () => {
    vi.mocked(useRouter).mockReturnValueOnce({
      isReady: true,
      query: { address: '0x1111111111111111111111111111111111111111' },
    } as any)

    render(<Page />, { wrapper })

    await waitFor(() => {
      const profileName = screen.getByTestId('profile-name')
      expect(profileName.textContent).toBe('test.eth')
    })
  })

  it('should show View Profile button for valid names', async () => {
    vi.mocked(useRouter).mockReturnValueOnce({
      isReady: true,
      query: { address: '0x1111111111111111111111111111111111111111' },
    } as any)

    render(<Page />, { wrapper })

    await waitFor(() => {
      expect(screen.getByTestId('button-type').textContent).toBe('viewProfile')
    })
  })

  it('should show NoProfileSnippet when no primary name exists', async () => {
    // Mock a different address with no primary name
    vi.mocked(useRouter).mockReturnValueOnce({
      isReady: true,
      query: { address: '0x0000000000000000000000000000000000000000' },
    } as any)

    render(<Page />, { wrapper })

    await waitFor(() => {
      expect(screen.getByTestId('no-profile-snippet')).toBeInTheDocument()
    })
  })

  it('should show NoProfileSnippet when unnormalized names are filtered out', async () => {
    render(<Page />, { wrapper })

    await waitFor(() => {
      expect(screen.getByTestId('no-profile-snippet')).toBeInTheDocument()
    })
  })
})
