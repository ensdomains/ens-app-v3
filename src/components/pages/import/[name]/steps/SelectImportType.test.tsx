import { mockFunction } from '@app/test-utils'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider } from 'styled-components'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAccount } from 'wagmi'

import { lightTheme } from '@ensdomains/thorin'

import { useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'
import { useResolver } from '@app/hooks/ensjs/public/useResolver'
import { useUnmanagedTLD } from '@app/hooks/useUnmanagedTLD'
import i18n from '@app/i18n'

import { calculateDnsSteps, SelectImportType } from './SelectImportType'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({ address: '0x123' })),
  useChainId: vi.fn(() => 1),
  useResolver: vi.fn(() => ({ data: null })),
  useConfig: vi.fn(() => ({
    chains: [{ id: 1, name: 'Mainnet' }],
    publicClient: {},
  })),
}))

vi.mock('@app/hooks/useUnmanagedTLD', () => ({
  useUnmanagedTLD: vi.fn(),
}))

const mockUseUnmanagedTLD = vi.fn()

vi.mock('@app/hooks/dns/useDnsSecEnabled', () => ({
  useDnsSecEnabled: vi.fn(() => ({ data: false })),
}))

vi.mock('@app/hooks/dns/useDnsOffchainStatus', () => ({
  useDnsOffchainStatus: vi.fn(() => ({
    data: { resolver: { status: 'matching' } },
    isLoading: false,
  })),
}))

vi.mock('@app/hooks/useQueryOptions', () => ({
  useQueryOptions: vi.fn(() => ({
    queryKey: ['test'],
    queryFn: () => null,
  })),
}))

describe('calculateDnsSteps', () => {
  describe('offchain', () => {
    const importType = 'offchain' as const
    const dnsOwner = null
    const dnsOwnerStatus = null
    it('returns correct steps for: dnssec not enabled, resolved address not matching', () => {
      const isDnsSecEnabled = false
      const offchainDnsStatus = { address: null } as ReturnType<typeof useDnsOffchainStatus>['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'enableDnssec', 'verifyOffchainOwnership', 'completeOffchain'])
    })
    it('returns correct steps for: dnssec enabled, resolved address not matching', () => {
      const isDnsSecEnabled = true
      const offchainDnsStatus = { address: null } as ReturnType<typeof useDnsOffchainStatus>['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'verifyOffchainOwnership', 'completeOffchain'])
    })
    it('returns correct steps for: dnssec not enabled, resolved address matching', () => {
      const isDnsSecEnabled = false
      const offchainDnsStatus = { address: { status: 'matching' } } as ReturnType<
        typeof useDnsOffchainStatus
      >['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'enableDnssec', 'completeOffchain'])
    })
    it('returns correct steps for: dnssec enabled, resolved address matching', () => {
      const isDnsSecEnabled = true
      const offchainDnsStatus = { address: { status: 'matching' } } as ReturnType<
        typeof useDnsOffchainStatus
      >['data']
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'completeOffchain'])
    })
  })
  describe('onchain', () => {
    const importType = 'onchain' as const
    const offchainDnsStatus = undefined
    it('returns correct steps for: dnssec not enabled, dns owner not matching', () => {
      const isDnsSecEnabled = false
      const dnsOwner = null
      const dnsOwnerStatus = null
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual([
        'selectType',
        'enableDnssec',
        'verifyOnchainOwnership',
        'transaction',
        'completeOnchain',
      ])
    })
    it('returns correct steps for: dnssec enabled, dns owner not matching', () => {
      const isDnsSecEnabled = true
      const dnsOwner = null
      const dnsOwnerStatus = null
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'verifyOnchainOwnership', 'transaction', 'completeOnchain'])
    })
    it('returns correct steps for: dnssec not enabled, dns owner matching', () => {
      const isDnsSecEnabled = false
      const dnsOwner = '0x1234'
      const dnsOwnerStatus = 'matching'
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'enableDnssec', 'transaction', 'completeOnchain'])
    })
    it('returns correct steps for: dnssec enabled, dns owner matching', () => {
      const isDnsSecEnabled = true
      const dnsOwner = '0x1234'
      const dnsOwnerStatus = 'matching'
      expect(
        calculateDnsSteps({
          importType,
          isDnsSecEnabled,
          offchainDnsStatus,
          dnsOwner,
          dnsOwnerStatus,
        }),
      ).toEqual(['selectType', 'transaction', 'completeOnchain'])
    })
  })
})

describe('SelectImportType component', () => {
  beforeEach(() => {
    vi.mocked(useUnmanagedTLD).mockReturnValue(false)
  })

  it('should show customized TLD message for .club domains', () => {
    vi.mocked(useUnmanagedTLD).mockReturnValue(true)
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <I18nextProvider i18n={i18n}>
            <SelectImportType
              dispatch={() => {}}
              item={{ type: null }}
              selected={{ name: 'test.club' }}
            />
          </I18nextProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    )
    expect(
      screen.getByText(
        "The team behind .club have customized their ENS experience, so we're unable to help you import the name at this time",
      ),
    ).toBeInTheDocument()
  })

  it('should show customized TLD message for TLDs not managed by DNSRegistrar', () => {
    vi.mocked(useUnmanagedTLD).mockReturnValue(true)
    vi.mocked(useDnsOffchainStatus).mockReturnValue({
      data: { resolver: { status: 'mismatching' } },
      isLoading: false,
    })
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <I18nextProvider i18n={i18n}>
            <SelectImportType
              dispatch={() => {}}
              item={{ type: null }}
              selected={{ name: 'test.xyz' }}
            />
          </I18nextProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    )
    expect(
      screen.getByText(
        "The team behind .xyz have customized their ENS experience, so we're unable to help you import the name at this time",
      ),
    ).toBeInTheDocument()
  })

  it('should show normal import options for managed TLDs', () => {
    vi.mocked(useUnmanagedTLD).mockReturnValue(false)
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <I18nextProvider i18n={i18n}>
            <SelectImportType
              dispatch={() => {}}
              item={{ type: null }}
              selected={{ name: 'test.com' }}
            />
          </I18nextProvider>
        </ThemeProvider>
      </QueryClientProvider>,
    )
    expect(screen.getByText(/How would you like to import your domain/)).toBeInTheDocument()
  })
})
