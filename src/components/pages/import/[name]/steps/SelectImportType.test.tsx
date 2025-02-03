import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAccount } from 'wagmi'

import { useDnsOffchainStatus } from '@app/hooks/dns/useDnsOffchainStatus'
import { useCustomizedTLD } from '@app/hooks/useCustomizedTLD'
import { mockFunction } from '@app/test-utils'

import { calculateDnsSteps, SelectImportType } from './SelectImportType'

import { vi } from 'vitest'

import { I18nextProvider } from 'react-i18next'
import i18n from '@app/i18n'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'
import { lightTheme } from '@ensdomains/thorin'

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

vi.mock('@app/hooks/useCustomizedTLD', () => ({
  useCustomizedTLD: vi.fn(),
}))

const mockUseCustomizedTLD = vi.fn()

vi.mock('@app/hooks/dns/useDnsSecEnabled', () => ({
  useDnsSecEnabled: vi.fn(() => ({ data: false })),
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
    vi.mocked(useCustomizedTLD).mockReturnValue(false)
  })

  it('should show customized TLD message for .club domains', () => {
    vi.mocked(useCustomizedTLD).mockReturnValue(true)
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
      </QueryClientProvider>
    )
    expect(screen.getByText(/The team behind club/)).toBeInTheDocument()
  })

  it('should show normal import options for non-customized TLDs', () => {
    mockUseCustomizedTLD.mockReturnValue(false)
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
      </QueryClientProvider>
    )
    expect(screen.getByText(/How would you like to import your domain/)).toBeInTheDocument()
  })
})
